import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  DollarSign,
  MapPin,
  ShoppingCart,
} from "lucide-react";

import { useCart } from "../CartContext/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Checkout = () => {
  const BASE_URL = "http://localhost:5000/api";
  const IMAGE_BASE = BASE_URL.replace("/api", "");

  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "cod",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  // capture total before clearing
  const [orderTotal, setOrderTotal] = useState(0);

  // State to hold map of book IDs to image paths
  const [images, setImages] = useState({});

  useEffect(() => {
    axios
      .get(`${BASE_URL}/books`)
      .then(({ data }) => {
        const books = Array.isArray(data) ? data : data.books || [];

        const map = {};

        books.forEach((b) => {
          if (b._id && b.image) map[b._id] = b.image;
        });
        setImages(map);
      })
      .catch((err) => console.error("Could not load Books Images", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () =>
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const subtotal = calculateTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not Authenticated");

      const items = cart.items.map((item) => ({
        id: item.id || item._id, // <-- make sure this is the Mongo _id of the Book
        name: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      const paymentMethodLabel =
        formData.paymentMethod === "cod"
          ? "Cash on Delivery"
          : "Online Payment";
      const paymentStatus =
        formData.paymentMethod === "online" ? "Paid" : "Pending";

      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          },
        },
        items,
        paymentMethod: paymentMethodLabel,
        paymentStatus,
        notes: formData.notes || "",
        deliveryDate: formData.deliveryDate || "",
      };

         const response = await axios.post(`${BASE_URL}/order`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response?.data;
    if (!data) throw new Error("No response data from server");

      setOrderTotal(total);

      await axios.delete(`${BASE_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      clearCart();

      if (formData.paymentMethod === "Online" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setOrderId(data.order?.orderId || null);
      setOrderPlaced(true);
    } catch (err) {
      console.error("Order Submitting Error", err);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#43C6AC] to-[#F8FFAE] py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from=[#1A237E] to-[#43C6AC] bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Thankyou for your Purchase. Your Order has been placed
              Successfully.
            </p>

            <div className="bg-gradient-to-r from-[#43C6AC]/10 to-[#F8FFAE]/10 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Order Id:</span>
                <span className="font-bold text-gray-900">{orderId}</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Payment Method:</span>
                <span className="font-bold text-gray-900">
                  {formData.paymentMethod === "cod"
                    ? "Cash On Delivery"
                    : "Online Payment"}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700">Total Amount:</span>
                <span className="font-bold text-xl text-[#1A237E]">
                  ₹{orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              We've sent a confirmation email to{" "}
              <span className="font-medium">{formData.email}</span> Your Order
              will be Shipped to:
            </p>

            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 max-w-lg mx-auto">
              <p className="text-gray-800">{formData.name}</p>
              <p className="text-gray-600">{formData.address}</p>
              <p className="text-gray-600">
                {formData.city}, {formData.state} {formData.zip}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/books"
                className="px-6 py-3 bg-gradient-to-r from-[#1A237E] to-[#43C6AC] text-white rounded-lg font-medium hover:opacity-90"
              >
                Continue Shopping
              </Link>

              <Link
                to="/order"
                className="px-6 py-3 bg-white border border-emerald-400 text-emerald-400 font-medium hover:bg-[#43C6AC]/10"
              >
                {" "}
                View Order Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: "cod",
      label: "Cash on Delivery",
      description: "Pay when you receive the order",
      icon: DollarSign,
      iconColor: "text-orange-500",
    },
    {
      id: "online",
      label: "Online Payment",
      description: "Pay with credit/debit card",
      icon: CreditCard,
      iconColor: "text-purple-500",
    },
  ];

  const formFields = [
    [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
    ],
    [
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "city", label: "City", type: "text", required: true },
    ],
    [
      {
        name: "address",
        label: "Street Address",
        type: "text",
        required: true,
        fullWidth: true,
      },
    ],
    [
      { name: "state", label: "State", type: "text", required: true },
      { name: "zip", label: "ZIP Code", type: "text", required: true },
    ],
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#43C6AC] to-[#F8FFAE] pt-28 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-[#1A237E] font-medium mb-10 hover:underline transition-colors duration-200 rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A237E]/30 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            Back to Cart
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Side */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-14 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
                Checkout Details
              </h2>
              <p className="text-gray-600 mb-10 text-base md:text-lg">
                Please Enter your Information to complete the Order
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-[#43C6AC]" />
                    Shipping Address
                  </h3>
                </div>

                {formFields.map((row, rowIndex) => (
                  <div
                    className={`grid grid-cols-1 ${
                      row.some((field) => field.fullWidth)
                        ? ""
                        : "md:grid-cols-2"
                    } gap-5 md:gap-6 ${rowIndex > 0 ? "mt-6" : ""}`}
                    key={rowIndex}
                  >
                    {row.map((field) => (
                      <div
                        className={field.fullWidth ? "col-span-full" : ""}
                        key={field.name}
                      >
                        <label className="block text-gray-700 mb-2.5 text-sm font-medium">
                          {field.label}
                        </label>

                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 border border-gray-200 rounded-xl bg-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43C6AC] focus-visible:ring-offset-2 focus-visible:border-transparent transition-shadow duration-200 shadow-sm"
                          required={field.required}
                        />
                      </div>
                    ))}
                  </div>
                ))}

                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-emerald-400" />
                    Payment Method
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {paymentMethods.map((method) => (
                      <div className="" key={method.id}>
                        <input
                          type="radio"
                          id={method.id}
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="hidden"
                        />

                        <label
                          htmlFor={method.id}
                          className={`block p-5 border-2 rounded-xl cursor-pointer transition duration-200 ${
                            formData.paymentMethod === method.id
                              ? "border-emerald-500/70 bg-emerald-50 ring-2 ring-emerald-400 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2`}
                        >
                          <div className="flex items-center gap-4">
                            <method.icon
                              className={`w-6 h-6 ${method.iconColor}`}
                            />

                            <div className="flex flex-col items-start leading-tight">
                              <span className="block font-medium text-gray-900">
                                {method.label}
                              </span>

                              <span className="block text-sm text-gray-600 mt-0.5">
                                {method.description}
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#1A237E] to-[#43C6AC] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-200 hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43C6AC] focus-visible:ring-offset-2"
                >
                  Place Order
                </button>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 lg:p-12 h-fit border border-gray-100 lg:sticky lg:top-28">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2 text-[#43C6AC]" />
                Order Summary
              </h2>

              <div className="border-b border-gray-200 pb-5 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Your Items
                </h3>
                <div className="space-y-4">
                  {cart.items.length > 0 ? (
                    cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-2"
                      >
                        <img
                          src={
                            images[item.id]
                              ? `${IMAGE_BASE}${images[item.id]}`
                              : "/placeholder.png"
                          }
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            by {item.author}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-medium text-gray-900">
                            ₹{item.price.toFixed(2)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Your cart is empty</p>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Order Details
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Subtotal", value: `₹${subtotal.toFixed(2)}` },
                    { label: "Shipping", value: "FREE" },
                    { label: "Tax", value: `₹${tax.toFixed(2)}` },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-[#1A237E]">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <div className="bg-gradient-to-r from-[#43C6AC]/10 to-[#F8FFAE]/10 rounded-xl p-4 ring-1 ring-inset ring-[#43C6AC]/20">
                <h3 className="font-medium text-gray-800 mb-2">
                  Delivery Estimate
                </h3>
                <p className="text-gray-600">
                  Your order will be delivered within 3-5 business days after
                  processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
