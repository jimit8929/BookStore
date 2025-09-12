import { useState } from "react";
import { styles as s } from "../assets/dummyStyles.js";
import axios from "axios";
import { BookPlus, Star } from "lucide-react";

const BASE_URL = "http://localhost:5000";

const initialFormData = {
  title: "",
  author: "",
  price: "",
  image: null,
  rating: 4,
  category: "Fiction",
  description: "",
  preview: "",
};

const categories = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Sci-Fi",
  "Biography",
  "Self-Help",
  "Thriller",
];

const AddBook = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: null });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ type: null, text: null });

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Skip preview and empty values
      if (key === "preview") return;
      if (value === null || value === "") return;
      payload.append(key, value);
    });

    try {
      await axios.post(`${BASE_URL}/api/books`, payload);
      setMessage({ type: "success", text: "Book Added Successfully" });

      // Revoke preview object URL if set
      if (formData.preview) URL.revokeObjectURL(formData.preview);

      setFormData(initialFormData);
    } catch (error) {
      console.error("AddBooks error", error.response?.data || error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add book.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Robust change handler (handles number/checkbox/text)
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => {
      let newValue;
      if (type === "checkbox") {
        newValue = checked;
      } else if (type === "number") {
        // allow empty string while editing, otherwise convert to number
        newValue = value === "" ? "" : Number(value);
        if (Number.isNaN(newValue)) newValue = "";
      } else {
        newValue = value;
      }
      return { ...prev, [name]: newValue };
    });
  };

  // Image Handling (fix: use files[0] and revoke previous preview)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => {
      // revoke previous preview if present
      if (prev.preview) {
        try {
          URL.revokeObjectURL(prev.preview);
        } catch (err) {
          // ignore
          console.log(err);
        }
      }
      return {
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      };
    });
  };

  // Rating
  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
    <div className={s.addBooks.addBookspage}>
      <div className={s.addBooks.addBookscontainer}>
        <div className={s.addBooks.headerContainer}>
          <div>
            <h1 className={s.addBooks.headerTitle}>Add New Book</h1>
            <p className={s.addBooks.headerSubtitle}>
              Fill in the details to add a new book to your store.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={s.addBooks.formContainer}>
          <div className={s.addBooks.formGrid}>
            <div className={s.addBooks.formItem}>
              <label htmlFor="title" className={s.addBooks.formLabel}>
                Book Title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={s.addBooks.formInput}
                placeholder="Enter Book Title"
                required
              />
            </div>

            <div className={s.addBooks.formItem}>
              <label htmlFor="author" className={s.addBooks.formLabel}>
                Author
              </label>
              <input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={s.addBooks.formInput}
                placeholder="Enter Author Name"
                required
              />
            </div>

            <div className={s.addBooks.formItem}>
              <label htmlFor="price" className={s.addBooks.formLabel}>
                Price (₹)
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={s.addBooks.formInput}
                placeholder="Enter Price"
                required
                min="0"
                step="0.01"
                inputMode="decimal"
              />
            </div>

            <div className={s.addBooks.formItem}>
              <label className={s.addBooks.formLabel}>Rating</label>

              <div className={s.addBooks.ratingContainer}>
                <div className={s.addBooks.starsContainer}>
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => handleStarClick(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${starValue} star${starValue !== 1 ? "s" : ""}`}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (hoverRating || formData.rating) >= starValue
                            ? s.addBooks.starFilled
                            : s.addBooks.starEmpty
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <p className={s.ratingStars.ratingText}>
                  {formData.rating} Star{formData.rating !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className={s.addBooks.formItem}>
              <label htmlFor="category" className={s.addBooks.formLabel}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={s.addBooks.formInput}
              >
                {categories.map((cat) => (
                  <option value={cat} key={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={s.addBooks.formItem}>
              <label htmlFor="image" className={s.addBooks.formLabel}>
                Cover Image
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={s.addBooks.formInput}
              />
            </div>

            <div className={`${s.addBooks.formItem} md:col-span-2`}>
              <label htmlFor="description" className={s.addBooks.formLabel}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={s.addBooks.formTextarea}
                placeholder="Enter Book Description"
              />
            </div>
          </div>

          {formData.preview && (
            <div className={s.addBooks.previewContainer}>
              <h3 className={s.addBooks.previewTitle}>Cover Preview</h3>
              <img src={formData.preview} alt="Cover preview" className={s.addBooks.previewImg} />
            </div>
          )}

          {message.text && (
            <p className={message.type === "success" ? "text-green-500" : "text-red-500"}>
              {message.text}
            </p>
          )}

          <div className={s.addBooks.submitContainer}>
            <button
              disabled={loading}
              type="submit"
              className={s.addBooks.submitButton}
              aria-busy={loading}
            >
              <BookPlus className="w-5 h-5" />
              <span>Add Book To Collection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
