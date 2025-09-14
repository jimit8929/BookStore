import { BookOpen, Filter, Trash2 } from "lucide-react";
import { styles as s } from "../assets/dummyStyles.js";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const ListBooks = () => {
  const [books, setBooks] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Fetch Book From Server
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(`${BASE_URL}/api/books`);
        setBooks(data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to Fetch Books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  //Fetch Categories
  const categories = useMemo(
    () => ["All", ...new Set(books.map((book) => book.category))],
    [books]
  );

  const displayedBooks = useMemo(() => {
    let filtered = books;
    if (filterCategory !== "All") {
      filtered = filtered.filter((book) => book.category === filterCategory);
    }

    if (sortConfig === "priceLowToHigh") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortConfig === "topRated") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [books, filterCategory, sortConfig]);

  const tableHeaders = [
    { key: null, label: "Book" },
    { key: "author", label: "Author" },
    { key: null, label: "Category" },
    { key: "price", label: "Price" },
    { key: "rating", label: "Rating" },
    { key: null, label: "Actions" },
  ];

  //Star Rating
  const RatingStar = ({ rating }) => (
    <div className={s.addBooks.ratingContainer}>
      <div className={s.addBooks.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? s.addBooks.starFilled
                : s.addBooks.starEmpty
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <span className={s.ratingStars.ratingText}>{rating.toFixed(1)}</span>
    </div>
  );

  //Delete Book Using ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you Sure?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/books/${id}`, {
        validateStatus: (status) => [200, 204, 500].includes(status),
      });

      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to Delete Book");
    }
  };

  return (
    <div className={s.booksList.listBookspage}>
      <div className={s.booksList.listBooksheader}>
        <h1 className={s.booksList.listBookstitle}>Manage Book Inventory</h1>
        <p className={s.booksList.listBookssubtitle}>
          View , Edit and Manage Your Book Collection.
        </p>
      </div>

      <div className={s.booksList.controlsContainer}>
        <div className={s.booksList.controlsInner}>
          <div className="flex gap-3">
            <div className={s.booksList.filterGroup}>
              <div className={s.booksList.filterGlow} />

              <div className={s.booksList.filterContainer}>
                <Filter className={s.booksList.filterIcon} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={s.booksList.filterSelect}
                >
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category == "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <p>Loading Books...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className={s.booksList.booksTableContainer}>
        <div className="overflow-x-auto">
          <table className={s.booksList.table}>
            <thead className={s.booksList.tableHead}>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.label}
                    className={s.booksList.tableHeader}
                    onClick={() =>
                      header.key &&
                      setSortConfig(sortConfig === header.key ? "" : header.key)
                    }
                  >
                    <div className={s.booksList.tableHeaderContent}>
                      {header.label}
                      {header.key && sortConfig === header.key && (
                        <span className="ml-1">↑</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {displayedBooks.map((book) => (
                <tr className={s.booksList.tableRow} key={book._id}>
                  <td className={s.booksList.tableCell}>
                    <div className="flex items-center">
                      {book.image && (
                        <img
                          src={`http://localhost:5000${book.image}`}
                          alt={book.title}
                          className="h-10 w-8 object-cover rounded"
                        />
                      )}
                      <div className="ml-4">
                        <div className={s.booksList.bookTitle}>
                          {book.title}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className={s.booksList.tableCell}>{book.author}</td>
                  <td className={s.booksList.tableCell}>
                    <span className={s.booksList.categoryBadge}>
                      {book.category}
                    </span>
                  </td>

                  <td className={s.booksList.tableCell}>₹{book.price}</td>
                  <td className={s.booksList.tableCell}>
                    <RatingStar rating={book.rating} />
                  </td>

                  <td className={`${s.addBooks.tableCell} flex-col gap-3`}>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className={s.booksList.deleteButton}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!displayedBooks.length && !loading && (
          <div className={s.booksList.emptyState}>
            <div className={s.emptyState.iconContainer}>
              <BookOpen className={s.emptyState.icon} />
            </div>

            <h3 className={s.emptyState.title}>No Books Found</h3>
            <p className={s.emptyState.message}>
              Try Adjusting your Filter or sort Options
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListBooks;
