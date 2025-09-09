import { useEffect, useState } from "react";
import {
  container,
  formContainer,
  geometricOverlay,
  glassBox,
  headerText,
  imageSection,
  imageStyle,
  imageWrapper,
  inputField,
  inputWrapper,
  overlayEffect,
  paragraphText,
  scrollText,
  scrollTextSection,
  searchButton,
  statBox,
  statLabel,
  statNumber,
  statsContainer,
  subHeader,
} from "../assets/dummystyles.js";

import { useNavigate } from "react-router-dom";

import { Search } from "lucide-react";

import { words } from "../assets/dummydata.js";

import image from "../assets/banner1.png";

const Banner = () => {
  const [searcQuery, setSearchQuery] = useState("");
  const [currentWord, setCurrentWord] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searcQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searcQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className={container}>
      <div className={glassBox}>
        <div className={geometricOverlay}>
          <div
            className="absolute -top-10 -right-10 md:-top-20 md:-right-20 w-48 h-48
          md:w-96 md:h-96 bg-[#F8FFAE]/10 rounded-full blur-xl md:blur-3xl"
          />
        </div>

        <div className="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 h-40 w-40 md:w-80 md:h-80 bg-[#43C6AC]/10 rounded-full blur-xl md:blur-3xl" />

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Section */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h1 className={headerText}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B5876] to-[#43C6AC]">
                  Mindful
                </span>
                <br />

                <span className={subHeader}>Reading Experience</span>
              </h1>

              <p className={paragraphText}>
                Dive into a world of knowledge and imagination with our curated
                collection of books. Whether you're seeking{" "}
                <span className="text-[#2B5876] font-semibold">
                  {words[currentWord]}
                </span>
                , adventure, or learning, we have something for every reader.
              </p>
            </div>

            {/* {Search Function} */}
            <form onSubmit={handleSearch} className="space-y-6 md:space-y-8">
              <div className={formContainer}>
                <div className={inputWrapper}>
                  <div className="absolute inset-0 bg-white/90 rounded-lg md:rounded-xl shadow-sm" />

                  <div className="relative flex items-center gap-2">
                    <Search className="ml-4 md:ml-5 w-5 h-5 md:w-6 md:h-6 text-gray-600 group-focus-within:text-[#2B5876]" />

                    <input
                      type="text"
                      value={searcQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Author, titles, or concept..."
                      className={inputField}
                    />
                  </div>
                </div>

                <button type="submit" className={searchButton}>
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </form>

            {/* STATS */}
            <div className={statsContainer}>
              {[
                { number: "50K+", label: "Titles" },
                { number: "1.2M", label: "Readers" },
                { number: "240+", label: "Topics" },
              ].map((stat, i) => (
                <div className={statBox} key={i}>
                  <div className={statNumber}>{stat.number}</div>
                  <div className={statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className={imageSection}>
            <div className={imageWrapper}>
              <img src={image} alt="Image Banner" className={imageStyle} />
              <div className={overlayEffect} />
            </div>
          </div>
        </div>

        {/* Footer Texts */}
        <div className={scrollTextSection}>
          <div className={scrollText}>
            Curated Collections • Award-Winning Authors • Critical Analysis •
            Cultural Perspective
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
