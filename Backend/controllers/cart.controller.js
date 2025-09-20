import cartModel from "../models/cart.model.js";
import bookModel from "../models/book.model.js";

//Add to Cart
export const addToCart = async (req, res) => {
  const { bookId, quantity } = req.body;

  if (!bookId || !quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Book id and valid quantity are required",
    });
  }

  try {
    const book = await bookModel.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not Found" });
    }

    let cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
      cart = await cartModel.create({
        user: req.user._id,
        items: [{ book: bookId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.book.toString() === bookId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ book: bookId, quantity });
      }

      await cart.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Item added to cart..", cart });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

//Get Cart
export const getCart = async (req, res) => {
  try {
    // auth guard
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthenticated" });
    }

    // Find cart and populate books. Use the correct model name "Book"
    const cart = await CartModel.findOne({ user: req.user._id })
      .populate({ path: "items.book", model: "Book" }) // ensure Book model registered as "Book"
      .lean();

    // If cart not found or no items, return an explicit empty cart
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalAmount: 0,
          tax: 0,
          shipping: 0,
          finalAmount: 0,
        },
        summary: { totalAmount: 0, tax: 0, shipping: 0, finalAmount: 0 },
      });
    }

    // compute totals
    let totalAmount = 0;
    const taxRate = 0.1; // 10% tax example
    const shipping = 50; // fixed shipping example

    cart.items.forEach(({ book, quantity }) => {
      // book may be populated (object) or just ObjectId
      const price = book?.price ? Number(book.price) : 0;
      totalAmount += price * Number(quantity || 0);
    });

    const tax = parseFloat((totalAmount * taxRate).toFixed(2));
    const finalAmount = parseFloat((totalAmount + tax + shipping).toFixed(2));

    // return populated cart and summary
    return res.status(200).json({
      success: true,
      cart,
      summary: { totalAmount, tax, shipping, finalAmount },
    });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving cart",
      error: error?.message,
    });
  }
};


//Update Cart
export const updateCart = async (req, res) => {
  const { bookId, quantity } = req.body;

  if (!bookId || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Valid book Id and Quantity are required",
    });
  }

  try {
    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not Found" });
    }

    const item = cart.items.find((item) => item.book.toString() === bookId);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not Found in cart" });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in updating cart items",
      error: error.message,
    });
  }
};

//Remove Cart
export const removeCartItem = async (req, res) => {
  const { bookId } = req.params;

  try {
    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not Found" });
    }

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Item Removed from Cart", cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Removing cart items",
      error: error.message,
    });
  }
};

//Clear User Cart
export const clearUserCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    return res.status(401).json({
      success: false,
      message: "Cart not Found",
    });
  }

  cart.items = [];

  await cart.save();

  res.status(200).json({ success: true, message: "Cart Cleared" });
};
