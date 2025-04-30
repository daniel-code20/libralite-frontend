import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Image } from "@nextui-org/react";
import AdminEditBookModal from "../../Modal/AdminEditBookModal";
import DeleteBookButton from "../../graphql/DeleteBookButton";
import AdminSideBar from "../components/AdminSideBar";
import { AdminSearchBar } from "../components/AdminSearchBar";
import {
  FaBars,
  FaTimes,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { Review } from "../../components/Review";

type Gender = {
  id: string; // Ahora el id es de tipo string, no any
  name: string;
};

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
      edition
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

const GET_ALL_GENDERS = gql`
  query GetAllGenders {
    genders {
      id
      name
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

export const AdminBookDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem("userId");

  const {
    loading: bookLoading,
    error: bookError,
    data: bookData,
  } = useQuery(GET_BOOK_DETAILS, {
    variables: { id },
  });

  const {
    loading: genderLoading,
    error: genderError,
    data: genderData,
  } = useQuery(GET_ALL_GENDERS);

  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_ALL_REVIEWS);

  useEffect(() => {
    if (bookData?.books.length > 0) {
      const selectedBook = {
        id: bookData.books[0].id,
        title: bookData.books[0].title,
        price: bookData.books[0].price,
        description: bookData.books[0].description,
        gender: bookData.books[0].gender.name,
        quantity,
      };
      localStorage.setItem("selectedBook", JSON.stringify(selectedBook));
      const totalPrice = bookData.books[0].price * quantity;
      setTotal(totalPrice);
    }
  }, [quantity, bookData]);

  useEffect(() => {
    const savedBook = localStorage.getItem("selectedBook");
    if (savedBook) {
      const parsedBook = JSON.parse(savedBook);
      setQuantity(parsedBook.quantity);
      setTotal(parsedBook.price * parsedBook.quantity);
    }
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflowX = "auto";
    }
  }, [sidebarOpen]);

  if (bookLoading || genderLoading || reviewsLoading) return <p>Cargando...</p>;
  if (bookError || genderError)
    return <p>Error: {bookError?.message || genderError?.message}</p>;
  if (reviewsError) return <p>Error: {reviewsError.message}</p>;

  const book = bookData?.books[0];
  const gender = genderData?.genders.find(
    (g: Gender) => g.id === book?.gender.id
  );

  if (!book || !gender)
    return <p>No se encontraron datos del libro o del género.</p>;

  // Función para renderizar estrellas
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return <div className="flex items-center">{stars}</div>;
  };

  // Calcular el rating promedio
  const averageRating = book.reviews.length
    ? book.reviews.reduce(
        (sum: number, review: { rating: number }) => sum + review.rating,
        0
      )
    : 0;

  return (
    <>
      <div className="flex min-h-screen bg-white overflow-y-auto">
        <div className="flex-grow flex flex-col transition-all duration-300">
          <header className="bg-white shadow-md flex items-center justify-between p-4 relative z-20 lg:ml-60">
            <AdminSideBar />
            <AdminSearchBar />
          </header>

          <div className="flex-grow flex flex-col p-4 lg:p-8 lg:ml-60">
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
                    {/* Mostrar estrellas */}
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(averageRating)}
                      <span className="text-gray-500 text-sm">
                        ({book.reviews.length} reseñas)
                      </span>
                    </div>
                    <p className="text-md text-gray-700 mb-4">
                      {book.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <p className="text-md font-semibold">Género:</p>
                      <p className="text-md text-gray-600">{gender.name}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <p className="text-md font-semibold">Edición:</p>
                      <p className="text-md text-gray-600">{book.edition}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <p className="text-lg font-semibold">Disponibles:</p>
                      <p className="text-lg text-gray-600">
                        {book.quantity} Unidades
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <p className="text-lg font-semibold">Precio:</p>
                      <p className="text-lg text-gray-600">
                        ${(book.price / 100).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex space-x-4 mt-4 mb-4">
                      <AdminEditBookModal
                        selectedGenre={gender.id}
                        bookId={book.id}
                      />
                      <DeleteBookButton BookId={book.id} />
                    </div>
                  </div>
                  <div className="w-full lg:col-span-3 flex flex-col space-y-6">
                    <Review bookId={book.id} userId={userId} isAdmin />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
