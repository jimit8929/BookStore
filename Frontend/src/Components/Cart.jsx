import { Cartstyles as s } from "../assets/dummystyles.js";
import {} from "../assets/dummydata.js";
import {
  ArrowRight,
  BookOpen,
  Minus,
  Plus,
  ShoppingBag,
  Trash,
} from "lucide-react";

import { useCart } from "../CartContext/CartContext.jsx";
import { useEffect } from "react";

import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, dispatch } = useCart();
  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const getImageSource = (item) => {
    if (typeof item.image === "string") return item.image;

    return item.image?.default;
  };

  const inc = (item) =>
    dispatch({
      type: "INCREMENT",
      payload: { id: item.id, source: item.source },
    });

  const dec = (item) =>
    dispatch({
      type: "DECREMENT",
      payload: { id: item.id, source: item.source },
    });

  const remove = (item) =>
    dispatch({
      type: "REMOVE_ITEM",
      payload: { id: item.id, source: item.source },
    });

  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <div className={s.header}>
          <h1 className={s.title}>
            <ShoppingBag className={s.titleIcon} /> Shopping Cart
          </h1>

          <p className={s.subtitle}>
            {cart.items.length} item{cart.items.length !== 1 && "s"} im your
            cart
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div className={s.emptyCard}>
            <div className={s.emptyIconWrapper}>
              <ShoppingBag className={s.emptyIcon} />
            </div>

            <h2 className={s.emptyTitle}>Your Cart feels lonely</h2>
            <p className={s.emptyDescription}>
              Discover our collection of premium books and start your reading
              journery.
            </p>

            <Link to="/books" className={s.browseBtn}>
              <BookOpen className={s.browseIcon} />
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className={s.cartGrid}>
            <div className={s.cartItems}>
              {cart.items.map((item) => (
                <div
                  className={s.cartItemCard}
                  key={`${item.source} - ${item.id}`}
                >
                  <div className={s.cartItemContent}>
                    <img
                      src={getImageSource(item)}
                      alt={item.title}
                      className={s.cartItemImage}
                    />

                    <div className="flex-1">
                      <div className={s.cartItemTop}>
                        <div>
                          <h3 className={s.itemTitle}>{item.title}</h3>
                          <p className={s.itemAuthor}>{item.author}</p>
                        </div>

                        <button
                          onClick={() => remove(item)}
                          className={s.removeBtn}
                        >
                          <Trash className={s.removeIcon} />
                        </button>
                      </div>

                      <div className={s.quantityPriceWrapper}>
                        <div className={s.quantityControls}>
                          <div className={s.quantityBox}>
                            <button
                              onClick={() => dec(item)}
                              className={s.qBtn}
                            >
                              <Minus className={s.qIcon} />
                            </button>
                            <span className={s.quantityValue}>
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => inc(item)}
                              className={s.qBtn}
                            >
                              <Plus className={s.qIcon} />
                            </button>
                          </div>

                          <span className={s.itemTotal}>
                            ₹ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <span className={s.pricePerItem}>
                          ₹{item.price.toFixed(2)} each
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={s.summaryCard}>
              <h2 className={s.summaryTitle}>Order Summary</h2>
              <div className={s.summaryBreakdown}>
                <div className={s.summaryRow}>
                  <span className={s.summaryLabel}>
                    Subtotal ({cart.items.length} items)
                  </span>
                  <span className={s.summaryValue}>₹{total.toFixed(2)}</span>
                </div>

                <div className={s.summaryRow}>
                  <span className={s.summaryLabel}>Shipping</span>
                  <span className={s.summaryShipping}>Free</span>
                </div>

                <div className={s.summaryRow}>
                  <span className={s.summaryLabel}>Taxes</span>
                  <span className={s.summaryShipping}>
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className={s.summaryTotalSection}>
                <div className={s.totalRow}>
                  <span className={s.summaryLabel}>Total</span>
                  <span className={s.totalAmount}>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button className={s.checkoutBtn}>
                Checkout Now
                <ArrowRight className={s.checkoutIcon} />
              </button>

              <Link to="/books" className={s.continueBtn}>
                <BookOpen className={s.continueIcon} /> Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
