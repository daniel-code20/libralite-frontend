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
        id
        url
      }
    }
  }
`;

export const ActiveSlider = () => {
  const { loading: booksLoading, error: booksError, data: booksData } = useQuery(GET_ALL_BOOKS);
  const [searchTerm] = useState('');

  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (booksLoading) return <CircularProgress label="Loading..." />;
  if (booksError) return <p>Error: {booksError.message}</p>;

  // Filtra los libros para mostrar solo los que tienen cantidad mayor a 0
  const filteredBooks = booksData.books.filter((book: Book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) && book.quantity > 0
  );

  return (
    <div className="flex items-start justify-center mb-8 animate__animated animate__fadeIn shadow-md bg-white rounded-md overflow-hidden max-w-full">
      <div className="w-full px-4">
        <h2 className="text-2xl font-bold mb-4 text-black mt-4">Populares</h2>
        <div className="relative">
          <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center z-10">
            &lt;
          </button>
          <div ref={sliderRef} className="flex overflow-x-scroll space-x-4 scrollbar-hide py-4 w-full">
            {filteredBooks.map((book: Book) => (
              <div key={book.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                <Link to={`/book/${book.id}`} className="block w-full h-full">
                  <div className="flex flex-col items-center mb-4">
                    <img
                      className="w-full object-cover shadow-lg"
                      alt={book.title}
                      src={book.image.url}
                      style={{ width: '150px', height: '200px' }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center z-10">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
