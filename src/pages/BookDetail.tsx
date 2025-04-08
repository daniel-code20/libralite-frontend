import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Button, Image } from "@nextui-org/react";
import SideBar from "../components/SideBar";
import { SearchBar } from "../components/SearchBar";
import { FaBars, FaTimes } from "react-icons/fa";
import ReviewForm from "../forms/ReviewForm";
import { Review } from "../components/Review";

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
      reviews {
        id
        comment
        rating
        user {
          id
          name
        }
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
  const userId = localStorage.getItem("userId");

  const {
    loading: booksLoading,
    error: booksError,
    data: booksData,
  } = useQuery(GET_BOOK_DETAILS, {
    variables: { id },
    onCompleted: () => {
      setQuantity(1);
    },
  });

  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_ALL_REVIEWS);

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
      localStorage.setItem("selectedBook", JSON.stringify(selectedBook));
      const totalPrice = booksData.books[0].price * quantity;
      setTotal(totalPrice);
    }
  }, [quantity, booksData]);

  useEffect(() => {
    const savedBook = localStorage.getItem("selectedBook");
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
    <div className="flex min-h-screen bg-white overflow-y-auto">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`flex-grow flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-60" : "ml-0"
        } lg:ml-60`}
      >
        <header className="bg-white shadow-md flex items-center justify-between p-4 relative z-20">
          <button
            className="lg:hidden p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <FaTimes className="h-6 w-6 text-black" />
            ) : (
              <FaBars className="h-6 w-6 text-black" />
            )}
          </button>
          <SearchBar />
        </header>

        <div className="flex-grow flex flex-col p-4 lg:p-8">
          <div className="max-w-6xl mx-auto p-6 lg:grid lg:grid-cols-3 lg:gap-8">
            {book && (
              <>
                {/* Imagen del libro */}
                <div className="w-full lg:w-auto flex flex-col justify-between">
                  <Image
                    src={book.image.url}
                    alt={book.title}
                    width={400}
                    height={500}
                    className="w-full h-auto rounded-sm object-cover shadow-lg mb-4"
                  />
                </div>

                {/* Información del libro */}
                <div className="lg:col-span-2">
                  <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                  <h2 className="text-lg mb-4 text-gray-600">
                    by {book.author?.name || "Autor desconocido"}
                  </h2>
                  <p className="text-md text-gray-700 mb-4">
                    {book.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <p className="text-md font-semibold">Género:</p>
                    <p className="text-md text-gray-600">{book.gender.name}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <p className="text-lg font-semibold">Disponibles:</p>
                    <p className="text-lg text-gray-600">
                      {book.quantity} Unidades
                    </p>
                  </div>

                  {/* Selector de cantidad */}
                  <div className="flex items-center mb-4">
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

                  <div className="flex flex-wrap gap-4 mb-4">
                    <p className="text-lg font-semibold">Total:</p>
                    <p className="text-lg">${(total / 100).toFixed(2)}</p>
                  </div>

                  {isOutOfStock ? (
                    <p className="text-lg font-semibold text-red-500">
                      Agotado
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      <Button
                        color="primary"
                        radius="sm"
                        variant="solid"
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
                      <Button
                        color="primary"
                        radius="sm"
                        variant="bordered"
                        className="w-full lg:w-auto"
                      >
                        <Link
                          to={`/reservation/${book.id}`}
                          key={`reservation-${book.id}`}
                          className="text-blue font-normal"
                        >
                          Reservar
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
                <div className="w-full lg:col-span-3 flex flex-col space-y-6 p-6">
                  {userId && <ReviewForm bookId={book.id} userId={userId} />}
                  <Review bookId={book.id} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
