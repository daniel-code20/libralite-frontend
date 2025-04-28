import { useState, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { CircularProgress } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import React from 'react';

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

export const AdminActiveSlider = () => {
  const { loading: booksLoading, error: booksError, data: booksData } = useQuery(GET_ALL_BOOKS);
  const [searchTerm] = useState('');

  const sliderRef = useRef<HTMLDivElement>(null);


  if (booksLoading) return <CircularProgress label="Loading..." />;
  if (booksError) return <p>Error: {booksError.message}</p>;

  const filteredBooks = booksData.books.filter((book: Book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) && book.quantity > 0
  );

  return (
    <div className="flex items-start justify-start mb-6 animate__animated animate__fadeIn shadow-md bg-white rounded-md overflow-hidden max-w-full">
          <div className="w-full px-4">
            <h2 className="text-2xl font-bold mb-3 text-black mt-4">Populares</h2>
            <div className="relative">
              <div
                ref={sliderRef}
                className="flex overflow-x-scroll space-x-2 scrollbar-hide py-3 w-full"
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
                    <div key={book.id} className="flex-shrink-0 w-[160px]">
                      <Link to={`/admin-book/${book.id}`} className="block w-full h-full">
                        <div className="flex flex-col items-start gap-1 mb-2">
                          <img
                            className="w-full object-cover shadow-md "
                            alt={book.title}
                            src={book.image.url}
                            style={{ width: "100%", height: "200px" }}
                          />
                          <h3 className="text-base font-semibold text-left text-black">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600 text-left">
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
                                xmlns="http://www.w3.org/2000/svg"
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
