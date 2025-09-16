import { ShoppingBag, Plus, Minus, Star, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCart } from "../CartContext/CartContext.jsx";
import { booksPageStyles as s } from "../assets/dummystyles.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { ourBestSellersStyles as styles } from "../assets/dummystyles";

const BASE_URL = "http://localhost:5000";

const Books = () => {
  const { cart, addToCart, updateCartItem } = useCart();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromURL = queryParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchFromURL);
  const [sortBy, setSortBy] = useState("title");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${BASE_URL}/api/books`);
        const data = res.data;

        const list = Array.isArray(data) ? data : data.books || [];
        setBooks(list);
      } catch (err) {
        console.error("Error Loading Books", err);
        setError(err.message || "Failed to Load Books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const isInCart = (id) => cart.items?.some((item) => item.id === id);
  const getCartQty = (id) =>
    cart?.items?.find((item) => item.id === id)?.quantity || 0;

  const handleAdd = (book) => {
    addToCart({
      id: book._id,
      title: book.title,
      price: book.price,
      quantity: 1,
    });
  };

  const handleInc = (id) => updateCartItem({ id, quantity: getCartQty(id) + 1 });
  const handleDec = (id) => updateCartItem({ id, quantity: getCartQty(id) - 1 });

    if(loading) return <div className={styles.loadingTitle}>Loading Best Sellers...</div>
    if(error) return <div className={styles.errorTitle}>{error}</div>

  const filterBooks = books.filter((book) => {
    const matchCategory =
      filterCategory === "all" || book.category === filterCategory;
    const lowerSearch = searchTerm.toLowerCase();
    const matchSearch =
      searchTerm === "" ||
      book.title.toLowerCase().includes(lowerSearch) ||
      book.author.toLowerCase().includes(lowerSearch);

    return matchCategory && matchSearch;
  });

  const sortedBooks = [...filterBooks].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return a.title.localeCompare(b.title, undefined, {
          sensitivity: "base",
          numeric: true,
        });
    }
  });

  const categories = [
    "all",
    ...new Set(books.map((book) => book.category).filter(Boolean)),
  ];

  return (
    <div className={s.container}>
      <div className={s.innerContainer}>
        <div className={s.headerWrapper}>
          <h1 className={s.headerTitle}>Literary Universe</h1>

          <p className={s.headerSubtitle}>
            Explore our curated collection spanning geners and perspectives
          </p>
        </div>

        <div className={s.searchWrapper}>
          <div className={s.searchInputWrapper}>
            <div className={s.searchIconWrapper}>
              <Search className="h-5 w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-emerald-300" />
            </div>

            <input
              type="text"
              placeholder="Search Titles, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={s.searchInput}
            />
          </div>

          <div className={s.filterRow}>
            <div className={s.selectGroup}>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={s.selectBox}
              >
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category === "all" ? "All Genres" : category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={s.selectBox}
              >
                <option value="title">Sort by Title</option>
                <option value="price-low">Price : Low to High</option>
                <option value="price-high">Price : High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className={s.resultText}>
              Showing {sortedBooks.length} results
            </div>
          </div>
        </div>

        <div className={s.booksGrid}>
          {sortedBooks.map((book) => {
            const inCart = isInCart(book._id);
            const qty = getCartQty(book._id);

            return (
              <div className={s.bookCard} key={book._id}>
                <div className={s.imageWrapper}>
                  <img
                    src={`${BASE_URL}${book.image}`}
                    alt={book.title}
                    className={s.imageStyle}
                  />
                </div>

                <h3 className={s.title}>{book.title}</h3>
                <p className={s.author}>{book.author}</p>

                <div className={s.ratingWrapper}>
                  {[
                    ...Array(
                      Number.isFinite(book.rating) ? Math.floor(book.rating) : 0
                    ),
                  ].map((_, index) => (
                    <Star
                      className="w-4 h-4 fill-yellow-400 stroke-yellow-400"
                      key={index}
                    />
                  ))}

                  <span>
                    (
                    {Number.isFinite(book.rating)
                      ? book.rating.toFixed(1)
                      : "Not Rated"}
                    )
                  </span>
                </div>

                <p className={s.description}>{book.description}</p>

                <div className={s.priceCartWrapper}>
                  <span className={s.price}>₹{book.price.toFixed(2)}</span>

                  <div className={s.cartButtons}>
                    {!inCart ? (
                      <button onClick={() => handleAdd(book)}>
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDec(book._id)}>
                          <Minus className="w-4 h-4 text-white cursor-pointer" />
                        </button>

                        <span>{qty}</span>

                        <button onClick={() => handleInc(book._id)}>
                          <Plus className="w-4 h-4 text-white cursor-pointer" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Books;
