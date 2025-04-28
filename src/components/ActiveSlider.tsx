import { useState, useRef, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { CircularProgress } from "@nextui-org/react";
import { Link } from "react-router-dom";
import React from "react";

interface Book {
  id: string;
  title: string;
  author: { name: string };
  image: { id: string; url: string };
  price: number;
  quantity: number;
  reviews: { rating: number }[];
}

const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    books {
      id
      title
      price
      quantity
      author {
        name
      }
      image {
        url
      }
      reviews {
        rating
      }
    }
  }
`;

export const ActiveSlider = () => {
  const { loading, error, data } = useQuery(GET_ALL_BOOKS);
  const [searchTerm] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);

  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      setCanScrollLeft(scrollLeft > 0);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 250; // Ajusta la cantidad de desplazamiento
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  if (loading) return <CircularProgress label="Loading..." />;
  if (error) return <p>Error: {error.message}</p>;

  const filteredBooks = data.books.filter(
    (book: Book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      book.quantity > 0
  );

  return (
    <div className="w-full max-w-screen-xl mx-auto flex flex-col mb-6 px-4 animate__animated animate__fadeIn bg-white rounded-md overflow-hidden shadow-md">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-3 text-black mt-4">Populares</h2>

        {/* Botones de scroll */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-10">
          <button
            onClick={() => scroll("left")}
            className={`bg-white rounded-full shadow-md p-2 ${
              !canScrollLeft ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!canScrollLeft}
          >
            &#8249;
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10">
          <button
            onClick={() => scroll("right")}
            className={`bg-white rounded-full shadow-md p-2 ${
              !canScrollRight ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!canScrollRight}
          >
            &#8250;
          </button>
        </div>

        {/* Carrusel */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide py-4 w-full px-2 lg:px-6 scroll-smooth"
            onScroll={checkScroll}
          >
            {filteredBooks.map((book: Book) => {
              const averageRating =
                book.reviews.length > 0
                  ? book.reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / book.reviews.length
                  : 0;

              return (
                <div
                  key={book.id}
                  className="flex-shrink-0 w-40 md:w-48 bg-white rounded-md"
                >
                  <Link to={`/book/${book.id}`} className="block w-full h-full">
                    <div className="flex flex-col items-start gap-2">
                      <img
                        className="w-full h-48 object-cover shadow-md rounded"
                        alt={book.title}
                        src={book.image.url}
                      />
                      <h3 className="text-sm font-semibold text-left text-black">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-600 text-left">
                        {book.author.name}
                      </p>
                      <div className="flex justify-start">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`w-4 h-4 ${
                              index < Math.round(averageRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15l-3.5 2 1-4.5L2 7h4.5L10 2l2.5 5.5H17l-5.5 5.5 1 4.5L10 15z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
