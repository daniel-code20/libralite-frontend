import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Button, Image } from '@nextui-org/react';
import estrella from '../assets/estrella (1).png';
import SideBar from '../components/SideBar';
import { SearchBar } from '../components/SearchBar';
import { FaBars, FaTimes } from 'react-icons/fa';

const GET_BOOK_DETAILS = gql`
  query Books($id: ID!) {
    books(where: { id: { equals: $id } }) {
      id
      title
      author {
        name
      }
      image {
        url
      }
      price
      quantity
      description
      gender {
        id
        name
      }
    }
  }
`;

const GET_ALL_REVIEWS = gql`
  query Reviews {
    reviews {
      rating
      book {
        id
      }
    }
  }
`;

export const BookDetail: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const { id } = useParams<{ id: string }>();

  const { loading: booksLoading, error: booksError, data: booksData } = useQuery(GET_BOOK_DETAILS, {
    variables: { id },
    onCompleted: () => {
      setQuantity(1);
    }
  });

  const { loading: reviewsLoading, error: reviewsError, data: reviewsData } = useQuery(GET_ALL_REVIEWS);

  useEffect(() => {
    if (booksData && booksData.books.length > 0) {
      const selectedBook = {
        id: booksData.books[0].id,
        title: booksData.books[0].title,
        price: booksData.books[0].price,
        description: booksData.books[0].description,
        gender: booksData.books[0].gender,
        quantity,
      };
      localStorage.setItem('selectedBook', JSON.stringify(selectedBook));
      const totalPrice = booksData.books[0].price * quantity;
      setTotal(totalPrice);
    }
  }, [quantity, booksData]);

  useEffect(() => {
    const savedBook = localStorage.getItem('selectedBook');
    if (savedBook) {
      const parsedBook = JSON.parse(savedBook);
      setQuantity(parsedBook.quantity);
      setTotal(parsedBook.price * parsedBook.quantity);
    }
  }, []);

  if (booksLoading || reviewsLoading) return <p>Loading...</p>;
  if (booksError) return <p>Error: {booksError.message}</p>;
  if (reviewsError) return <p>Error: {reviewsError.message}</p>;

  const book = booksData.books[0];

  const getRatingForBook = () => {
    const review = reviewsData.reviews.find(
      (review: { rating: number; book: { id: string } }) =>
        review.book.id === book.id
    );
    return review ? review.rating : null;
  };

  const incrementQuantity = () => {
    if (quantity < book.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const isOutOfStock = book.quantity === 0;

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-y-auto">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'} lg:ml-60`}>
        <header className="bg-white shadow-md flex items-center justify-between p-4 relative ml-4 mr-4 rounded-md z-20">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <FaTimes className="h-6 w-6 text-black" />
            ) : (
              <FaBars className="h-6 w-6 text-black" />
            )}
          </button>
          <SearchBar />
        </header>
        <div className="flex-grow flex flex-col p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:space-x-6 max-w-6xl mx-auto">
            {book && (
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 ">
                <Image
                  src={book.image.url}
                  alt={book.title}
                  width={300}
                  height={200}
                  radius="sm"
                  className="w-full h-full"
                />
                <div className='mt-4'>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">{book.title}</h1>

                  </div>

                  <h2 className="text-lg mb-2 font-regular">
                    by {book.author?.name || 'Autor desconocido'}
                  </h2>

                  <div className="max-w-md">
                    <p className="text-md mb-2 font-regular text-gray-600">
                      {book.description}
                    </p>
                  </div>
                  <div className="flex items-start space-x-1">
                    <p className="text-md mb-2 font-semibold">
                      Género:
                    </p>
                    <p className="text-md mb-2 font-regular text-gray-600">
                      {book.gender.name}
                    </p>
                  </div>

                  <div className="flex items-start space-x-1">
                    <p className="text-lg mb-2 font-semibold">
                      Disponibles:
                    </p>
                    <p className="text-lg mb-2 font-regular text-gray-600">
                      {book.quantity} Unidades
                    </p>
                  </div>

                  <div className="flex items-center mb-2">
                    <Button
                      className="font-bold"
                      radius="sm"
                      color="primary"
                      variant="light"
                      onClick={decrementQuantity}
                      disabled={isOutOfStock}
                    >
                      -
                    </Button>
                    <span className="mx-4 text-lg">{quantity}</span>
                    <Button
                      className="font-bold"
                      radius="sm"
                      color="primary"
                      variant="light"
                      onClick={incrementQuantity}
                      disabled={isOutOfStock}
                    >
                      +
                    </Button>
                  </div>
                  <div className="flex items-start space-x-1">
                    <p className="text-lg mb-2 font-semibold">
                      Total:
                    </p>
                    <p className="text-lg mb-2 font-regular">
                      ${(total / 100).toFixed(2)}
                    </p>
                  </div>
                  {isOutOfStock ? (
                    <p className="text-lg mb-2 font-semibold text-red-500">
                      Agotado
                    </p>
                  ) : (
                    <div className="flex space-x-4">
                      <Button
                        color="primary"
                        radius="sm"
                        variant="shadow"
                        className="w-full lg:w-auto"
                      >
                        <Link
                          to={`/buy/${book.id}`}
                          key={`buy-${book.id}`}
                          className="text-white font-semibold"
                        >
                          Comprar
                        </Link>
                      </Button>

                      <Button color="primary" radius="sm" variant="flat" className="w-full lg:w-auto">
                        <Link
                          to={`/reservation/${book.id}`}
                          key={`reservation-${book.id}`}
                          className="text-blue font-semibold"
                        >
                          Reservar
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>


  );
};
