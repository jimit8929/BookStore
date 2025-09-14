// controllers/order.controller.js
import OrderModel from "../models/order.model.js";
import BookModel from "../models/book.model.js";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

// instantiate Razorpay properly (use both keys on backend)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//Create an order
export const createOrder = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod, notes, deliveryDate } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid or empty items array." });
    }

    const normalizedPM = ["Cash on Delivery", "Online Payment"].includes(
      paymentMethod
    )
      ? paymentMethod
      : "Online Payment";

    const orderId = `ORD-${uuidv4()}`;

    // compute totals (you can include tax/shipping logic as needed)
    const totalAmount = items.reduce(
      (sum, i) => sum + Number(i.price) * Number(i.quantity),
      0
    );
    const taxAmount = +(totalAmount * 0.05).toFixed(2);
    const shippingCharge = 0;
    const payable = +(totalAmount + taxAmount + shippingCharge).toFixed(2);

    // shipping address map
    const shippingAddress = {
      fullName: customer.name,
      email: customer.email,
      phoneNumber: customer.phone,
      street: customer.address.street,
      city: customer.address.city,
      state: customer.address.state,
      zipCode: customer.address.zip,
    };

    // validate items and build order items array
    const orderItems = await Promise.all(
      items.map(async (i) => {
        const bookDoc = await BookModel.findById(i.id).lean();
        if (!bookDoc) {
          const err = new Error(`Book Not Found ${i.id}`);
          err.status = 400;
          throw err;
        }

        return {
          book: bookDoc._id,
          title: bookDoc.title,
          author: bookDoc.author,
          image: bookDoc.image,
          price: Number(i.price),
          quantity: Number(i.quantity),
        };
      })
    );

    const baseOrderData = {
      orderId,
      user: req.user._id,
      shippingAddress,
      books: orderItems,
      shippingCharge,
      totalAmount,
      taxAmount,
      paymentMethod: normalizedPM,
      notes,
      deliveryDate,
    };

    // Online Payment flow => create a Razorpay Order
    if (normalizedPM === "Online Payment") {
      // Razorpay expects amount in paise (smallest currency unit)
      const amountInPaise = Math.round(payable * 100);

      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: orderId,
        payment_capture: 1, // auto-capture; set 0 if you want manual capture
      });

      // store order in DB with razorpay order id (payment will be verified later)
      const newOrder = new OrderModel({
        ...baseOrderData,
        paymentStatus: "Unpaid",
        razorpayOrderId: razorpayOrder.id,
        razorpayOrderAmount: razorpayOrder.amount, // paise
        razorpayReceipt: razorpayOrder.receipt,
      });

      await newOrder.save();

      // Send minimal razorpay data to frontend to open checkout
      return res.status(201).json({
        order: newOrder,
        razorpay: {
          key_id: process.env.RAZORPAY_KEY_ID, // frontend uses this
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      });
    }

    // Cash on Delivery flow
    const newOrder = new OrderModel({
      ...baseOrderData,
      paymentStatus: "Unpaid", 
    });

    await newOrder.save();
    return res.status(201).json({ order: newOrder, razorpay: null });
  } catch (error) {
    console.error("createOrder error:", error);
    next(error);
  }
};

//Confirm Payment
export const confirmPayment = async (req, res, next) => {
  try {
    // Expect these in req.body (POST)
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Required payment fields missing" });
    }

    // 1) Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 2) Optionally fetch the payment from Razorpay to confirm its status
    //    (useful to ensure it's 'captured' if you used payment_capture: 1 it should be 'captured')
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (fetchErr) {
      // If fetching fails, still proceed carefully (log and return error)
      console.error("Failed to fetch payment from Razorpay:", fetchErr);
      return res
        .status(500)
        .json({ message: "Failed to verify payment with Razorpay" });
    }

    // Accept captured (auto-capture) or captured/authorized depending on your flow
    if (
      !payment ||
      (payment.status !== "captured" && payment.status !== "authorized")
    ) {
      return res.status(400).json({
        message: "Payment not completed",
        paymentStatus: payment?.status,
      });
    }

    // 3) Update your order in DB
    const order = await OrderModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id }, // or use your own orderId field mapping
      {
        $set: {
          paymentStatus: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          paidAt: new Date(),
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ success: true, order, payment });
  } catch (error) {
    console.error("confirmPayment error:", error);
    next(error);
  }
};

//Get All Orders
export const getOrders = async (req, res, next) => {
  try {
    const { search = "", status, sync } = req.query;
    const filter = {};

    if (status) filter.orderStatus = status;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { orderId: regex },
        { "shippingAddress.fullName": regex },
        { "shippingAddress.email": regex },
        { "books.title": regex },
        { razorpayOrderId: regex }, // allow searching by razorpay order id
        { razorpayPaymentId: regex }, // allow searching by razorpay payment id
      ];
    }

    // fetch orders from DB
    let orders = await OrderModel.find(filter).sort({ placedAt: -1 }).lean();

    if (sync === "true") {
      // iterate sequentially to avoid spamming Razorpay — you can parallelize with care
      for (const o of orders) {
        try {
          // only try to reconcile if we have a razorpayOrderId and order is not already Paid
          if (o.razorpayOrderId && o.paymentStatus !== "Paid") {
            // fetch payments for the order from Razorpay
            // This calls GET /v1/orders/:id/payments
            const resp = await razorpay.orders.fetchPayments(o.razorpayOrderId);
            const payments = resp?.items ?? resp?.payments ?? [];

            // look for a captured payment
            const captured = payments.find(
              (p) => p && (p.status === "captured" || p.captured === true)
            );

            if (captured) {
              // update DB order to Paid
              await OrderModel.findOneAndUpdate(
                { razorpayOrderId: o.razorpayOrderId },
                {
                  $set: {
                    paymentStatus: "Paid",
                    razorpayPaymentId:
                      captured.id ||
                      captured.payment_id ||
                      captured.entity === "payment"
                        ? captured.id
                        : undefined,
                    paidAt: new Date(),
                  },
                }
              );

              // also update local copy to reflect new status in response
              o.paymentStatus = "Paid";
              o.razorpayPaymentId = captured.id || o.razorpayPaymentId;
              o.paidAt = new Date();
            } else {
              // optionally, if any payment failed, you can set Unpaid / Failed
              // (left as-is for safety)
            }
          }
        } catch (rzErr) {
          console.warn(
            `Failed to reconcile order ${o.orderId || o.razorpayOrderId}:`,
            rzErr.message || rzErr
          );
          // continue with next order
        }
      }

      // re-read orders to reflect DB-updates (optional)
      orders = await OrderModel.find(filter).sort({ placedAt: -1 }).lean();
    }

    // compute counts
    const counts = orders.reduce(
      (acc, o) => {
        acc.totalOrders = (acc.totalOrders || 0) + 1;
        const statusKey = o.orderStatus || "Unknown";
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        if (o.paymentStatus === "Unpaid" || o.paymentStatus === "Pending") {
          acc.pendingPayment = (acc.pendingPayment || 0) + 1;
        }
        if (o.paymentStatus === "Paid") {
          acc.paid = (acc.paid || 0) + 1;
        }
        return acc;
      },
      { totalOrders: 0, pendingPayment: 0, paid: 0 }
    );

    res.json({
      counts: {
        totalOrders: counts.totalOrders,
        pending: counts.Pending || 0,
        processing: counts.Processing || 0,
        shipped: counts.Shipped || 0,
        delivered: counts.Delivered || 0,
        cancelled: counts.Cancelled || 0,
        paid: counts.paid || 0,
        pendingPayment: counts.pendingPayment,
      },
      orders,
    });
  } catch (error) {
    next(error);
  }
};

//Get Order by Id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not Found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

//Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ user: req.user._id })
      .populate("books.book")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get User orders errors :", error);
    res.status(500).json({ error: "Failed to fetch User Orders" });
  }
};

//Update Order
export const updateOrder = async (req, res, next) => {
  try {
    const allowed = ["orderStatus", "paymentStatus", "deliveryDate", "notes"];

    const updateData = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updated = await OrderModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: "Order not Found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

//Delete Method
export const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await OrderModel.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ message: "Order not Found" });
    }

    res.json({ message: "Order Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};
