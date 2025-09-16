import React, { useEffect, useState } from "react";
import { homeBooksStyles as styles } from "../assets/dummystyles.js";
import { useCart } from "../CartContext/CartContext.jsx";
import { ArrowRight, Minus, Plus, ShoppingCart, Star } from "lucide-react";

import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const HomeBooks = () => {
  const { cart, addToCart, updateCartItem } = useCart();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inCart = (id) => cart.items.some((item) => item.id === id);
  const getQty = (id) =>
    cart?.items?.find((item) => item.id === id)?.quantity || 0;


  useEffect(() => {
    const fetchBooks = async() => {
      setLoading(true);

      try{
        const res = await axios.get(`${BASE_URL}/api/books`);
        const list = Array.isArray(res.data) ? res.data : res.data.books || [];
        setBooks(list);
      }
      catch(err){
        setError(err.message || "Failed to Load Books")
      }
      finally{
        setLoading(false);
      }
    }
    fetchBooks();
  },[]);

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

    if(loading) return <div className={styles.loadingTitle}>Loading Books...</div>
    if(error) return <div className={styles.errorTitle}>{error}</div>

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className="text-center mb-12">
            <h2 className={styles.heading}>Bookseller Favorites</h2>
            <div className={styles.headingLine} />
          </div>

          <div className={styles.grid}>
            {books.map((book) => {
              const itemInCart = inCart(book._id);
              return (
                <div className={styles.bookCard} key={book._id}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={book.image.startsWith("http") ? book.image : `${BASE_URL}${book.image}`}
                      alt={book.title}
                      className={styles.image}
                    />

                    <div className={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          className={`h-4 w-4 ${
                            i < Math.floor(book.rating || 0)
                              ? "text-[#43C6AC] fill-[#43C6AC]"
                              : "text-gray-300"
                          }`}
                          key={i}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className={styles.title}>{book.title}</h3>

                  <p className={styles.author}>{book.author}</p>

                  <span className={styles.actualPrice}>₹{book.price.toFixed(2)}</span>

                  {itemInCart ? (
                    <div className={styles.qtyBox}>
                      <button
                        onClick={() => handleDec(book._id)}
                        className={styles.qtyBtn}
                      >
                        <Minus size={18} className="cursor-pointer" />
                      </button>

                      <span className="text-gray-700">{getQty(book._id)}</span>

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
                      className={styles.addBtn}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.viewBtnWrapper}>
            <Link to="/books" className={styles.viewBtn}>
              <span>View All Books</span>
              <ArrowRight className={styles.viewIcon} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBooks;
