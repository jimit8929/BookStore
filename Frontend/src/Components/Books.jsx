import { ShoppingBag, Plus, Minus, Star, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCart } from "../CartContext/CartContext.jsx";
import { booksPageStyles as s } from "../assets/dummystyles.js";

import BP1 from "../assets/Book1.png";
import BP2 from "../assets/Book2.png";
import BP3 from "../assets/Book3.png";
import BP4 from "../assets/Book4.png";
import BP5 from "../assets/Book5.png";
import BP6 from "../assets/Book6.png";
import BP7 from "../assets/Book7.png";
import BP8 from "../assets/Book8.png";
import BP9 from "../assets/BP9.png";
import BP10 from "../assets/BP10.png";
import BP11 from "../assets/BP11.png";
import BP12 from "../assets/BP12.png";
import BP13 from "../assets/BP13.png";
import BP14 from "../assets/BP14.png";
import BP15 from "../assets/BP15.png";
import BP16 from "../assets/BP16.png";
import { useState } from "react";

const Books = () => {
  const books = [
    {
      id: 1,
      image: BP1,
      title: "The Silent Echo",
      author: "Sarah Mitchell",
      price: 205,
      rating: 4.5,
      category: "Mystery",
      description:
        "A haunting tale of secrets and revelations that echo through time.",
    },
    {
      id: 2,
      image: BP2,
      title: "Digital Fortress",
      author: "James Cooper",
      price: 190,
      rating: 4.2,
      category: "Thriller",
      description:
        "In the age of digital warfare, no secret is safe from discovery.",
    },
    {
      id: 3,
      image: BP3,
      title: "The Last Orbit",
      author: "Emily Zhang",
      price: 202,
      rating: 4.7,
      category: "Sci-Fi",
      description:
        "Humanity's final journey among the stars holds unexpected truths.",
    },
    {
      id: 4,
      image: BP4,
      title: "Beyond the Stars",
      author: "Michael Chen",
      price: 209,
      rating: 4.3,
      category: "Sci-Fi",
      description:
        "An epic space odyssey that challenges our understanding of existence.",
    },
    {
      id: 5,
      image: BP5,
      title: "Mystic River",
      author: "Dennis Lehane",
      price: 180,
      rating: 4.8,
      category: "Drama",
      description:
        "A powerful story of friendship, trauma, and the price of secrets.",
    },
    {
      id: 6,
      image: BP6,
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: 160,
      rating: 4.9,
      category: "Philosophy",
      description:
        "A mystical journey of self-discovery and the pursuit of dreams.",
    },
    {
      id: 7,
      image: BP7,
      title: "Atomic Habits",
      author: "James Clear",
      price: 203,
      rating: 4.6,
      category: "Self-Help",
      description:
        "Transform your life through the power of tiny, consistent changes.",
    },
    {
      id: 8,
      image: BP8,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      price: 219,
      rating: 4.4,
      category: "Psychology",
      description:
        "Explore the two systems that drive the way we think and make decisions.",
    },
    {
      id: 9,
      title: "The Design Of Books",
      author: "Debbie Bern",
      price: 379,
      description:
        "A Gothic tale of science gone wrong and its consequences...",
      image: BP9,
    },
    {
      id: 10,
      title: "The Crossing",
      author: "Jason Mott",
      price: 425,
      description: "A psychological exploration of guilt and redemption...",
      image: BP10,
    },
    {
      id: 11,
      title: "The Phoenix Of Destiny",
      author: "Geronimo Stilton",
      price: 499,
      description: "A fantasy adventure through Middle-earth...",
      image: BP11,
    },
    {
      id: 12,
      title: "The Author",
      author: "Raj Siddhi",
      price: 399,
      description:
        "A dystopian vision of a scientifically engineered society...",
      image: BP12,
    },
    {
      id: 13,
      title: "The Doctor",
      author: "Oscar Patton",
      price: 549,
      description: "An epic journey through Hell, Purgatory, and Paradise...",
      image: BP13,
    },
    {
      id: 14,
      title: "Darkness Gathers",
      author: "Emma Elliot",
      price: 325,
      description:
        "A turbulent story of passion and revenge on the Yorkshire moors...",
      image: BP14,
    },
    {
      id: 15,
      title: "Gitanjali",
      author: "RabindraNath Tagore",
      price: 449,
      description: "The epic poem about the Trojan War and Achilles' rage...",
      image: BP15,
    },
    {
      id: 16,
      title: "The Unwilling",
      author: "John Hart",
      price: 399,
      description:
        "The adventures of a nobleman who imagines himself a knight...",
      image: BP16,
    },
  ];

  const { cart, dispatch } = useCart();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromURL = queryParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchFromURL);
  const [sortBy, setSortBy] = useState("title");
  const [filterCategory, setFilterCategory] = useState("all");

  const isInCart = (id) =>
    cart?.items?.some((item) => item.id === id && item.source === "booksPage");

  const getCartQuantity = (id) =>
    cart?.items?.find((item) => item.id === id && item.source === "booksPage")
      ?.quantity || 0;

  const handleAddToCart = (book) =>
    dispatch({
      type: "ADD_ITEM",
      payload: { ...book, quantity: 1, source: "booksPage" },
    });

  const handleIncrement = (id) =>
    dispatch({ type: "INCREMENT", payload: { id, source: "booksPage" } });

  const handleDecrement = (id) =>
    dispatch({ type: "DECREMENT", payload: { id, source: "booksPage" } });

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
        return b.rating - a.rating;
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
            const inCart = isInCart(book.id);
            const qty = getCartQuantity(book.id);

            return (
              <div className={s.bookCard} key={book.id}>
                <div className={s.imageWrapper}>
                  <img
                    src={book.image}
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
                    ){" "}
                  </span>
                </div>

                <p className={s.description}>{book.description}</p>

                <div className={s.priceCartWrapper}>
                  <span className={s.price}>₹{book.price.toFixed(2)}</span>

                  <div className={s.cartButtons}>
                    {!inCart ? (
                      <button onClick={() => handleAddToCart(book)}>
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDecrement(book.id)}>
                          <Minus className="w-4 h-4 text-white cursor-pointer" />
                        </button>

                        <span>{qty}</span>

                        <button onClick={() => handleIncrement(book.id)}>
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
