import React, { useEffect, useRef, useState } from "react";
import { ourBestSellersStyles as styles } from "../assets/dummystyles";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { bgColors } from "../assets/dummydata.js";
import { useCart } from "../CartContext/CartContext.jsx";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const OurBestSeller = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () =>
    scrollRef.current.scrollBy({
      left: -400,
      behavior: "smooth",
    });

  const scrollRight = () =>
    scrollRef.current.scrollBy({
      left: 400,
      behavior: "smooth",
    });

  const { cart, addToCart, updateCartItem } = useCart();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Fetch Books from Server
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${BASE_URL}/api/books`);
        setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
      } catch (err) {
        console.error("Error Fetching best Books", err);
        setError(err.message || "Failed to Fetch Books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const inCart = (id) => cart.items.some((item) => item.id === id);
  const getQty = (id) =>
    cart?.items?.find((item) => item.id === id)?.quantity || 0;

  const handleAdd = (book) => {
    addToCart({
      id: book._id,
      title: book.title,
      price: book.price,
      quantity: 1,
    });
  };

  const handleInc = (id) => updateCartItem({ id, quantity: getQty(id) + 1 });
  const handleDec = (id) => updateCartItem({ id, quantity: getQty(id) - 1 });


  if(loading) return <div className={styles.loadingTitle}>Loading Best Sellers...</div>
  if(error) return <div className={styles.errorTitle}>{error}</div>

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div className={styles.title}>
            <h1 className={styles.title}>
              <span className={styles.gradientText}>Curated Excellece</span>
            </h1>

            <p className={styles.subtitle}>Top Rated by Our Readers</p>
          </div>

          <div className={styles.navWrapper}>
            <div className={styles.navLine} />
            <div className={styles.navButtons}>
              <button onClick={scrollLeft} className={styles.navBtn}>
                <ChevronLeft className={styles.navIcon} size={20} />
              </button>

              <button onClick={scrollRight} className={styles.navBtn}>
                <ChevronRight className={styles.navIcon} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className={styles.scrollContainer} ref={scrollRef}>
          {books.map((book, index) => (
            <div
              className={styles.card(bgColors[index % bgColors.length])}
              key={book._id}
            >
              <div className={styles.cardInner}>
                <div className="space-y-3 md:space-y-4">
                  <div className={styles.stars}>
                    {[...Array(Math.floor(book.rating || 0))].map((_, i) => (
                      <Star
                        className="h-4 w-4 md:h-5 md:w-5 text-amber-400 fill-amber-500"
                        key={i}
                      />
                    ))}
                  </div>

                  <div className={styles.bookInfo}>
                    <h2 className={styles.bookTitle}>{book.title}</h2>
                    <p className={styles.bookAuthor}>{book.author}</p>
                  </div>

                  <p className={styles.bookDesc}>{book.description}</p>
                </div>

                {/* Add Controls */}
                <div className={styles.cartControls}>
                  <div className={styles.priceQtyWrapper}>
                    <span className={styles.price}>
                      ₹ {book.price.toFixed(2)}
                    </span>
                    {inCart(book._id) ? (
                      <div className={styles.qtyWrapper}>
                        <button
                          onClick={() => handleDec(book._id)}
                          className={styles.qtyBtn}
                        >
                          <Minus size={18} className="cursor-pointer" />
                        </button>

                        <span className={styles.qtyText}>
                          {getQty(book._id)}
                        </span>

                        <button
                          onClick={() => handleInc(book._id)}
                          className={styles.qtyBtn}
                        >
                          <Plus size={18} className="cursor-pointer" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(book)}
                        className={styles.addButton}
                      >
                        <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                        <span>Add to Collection</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <img
                src={book.image.startsWith("http") ? book.image : `${BASE_URL}${book.image}`}
                alt={book.title}
                className={styles.bookImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurBestSeller;
