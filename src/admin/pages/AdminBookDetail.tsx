import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Image } from '@nextui-org/react';
import estrella from '../../assets/estrella (1).png';
import AdminEditBookModal from '../../Modal/AdminEditBookModal';
import DeleteBookButton from '../../graphql/DeleteBookButton';
import AdminSideBar from '../components/AdminSideBar';
import { AdminSearchBar } from '../components/AdminSearchBar';
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

  const { loading: bookLoading, error: bookError, data: bookData } = useQuery(GET_BOOK_DETAILS, {
    variables: { id },
  });

  const { loading: genderLoading, error: genderError, data: genderData } = useQuery(GET_ALL_GENDERS);

  const { loading: reviewsLoading, error: reviewsError, data: reviewsData } = useQuery(GET_ALL_REVIEWS);

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
      localStorage.setItem('selectedBook', JSON.stringify(selectedBook));
      const totalPrice = bookData.books[0].price * quantity;
      setTotal(totalPrice);
    }
  }, [quantity, bookData]);

  useEffect(() => {
    const savedBook = localStorage.getItem('selectedBook');
    if (savedBook) {
      const parsedBook = JSON.parse(savedBook);
      setQuantity(parsedBook.quantity);
      setTotal(parsedBook.price * parsedBook.quantity);
    }
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflowX = 'auto';
    }
  }, [sidebarOpen]);

  if (bookLoading || genderLoading || reviewsLoading) return <p>Cargando...</p>;
  if (bookError || genderError) return <p>Error: {bookError?.message || genderError?.message}</p>;
  if (reviewsError) return <p>Error: {reviewsError.message}</p>;

  const book = bookData?.books[0];
  const gender = genderData?.genders.find((g: { id: any; }) => g.id === book?.gender.id);

  if (!book || !gender) return <p>No se encontraron datos del libro o del género.</p>;

  const getRatingForBook = () => {
    const review = reviewsData?.reviews.find(
      (review: { rating: number; book: { id: string } }) =>
        review.book.id === book.id
    );
    return review ? review.rating : null;
  };

  const formatPrice = (price: number) => {
    if (isNaN(price)) return '$0.00'; // Manejar valores no numéricos
    return `$${price.toFixed(2)}`;
  };

  return (
    <>
      <div className="flex min-h-screen bg-white overflow-y-auto">
  <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  <div
    className={`flex-grow flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-0"} lg:ml-60`}
  >
    <header className="bg-white shadow-md flex items-center justify-between p-4 relative z-20">
      <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? (
          <FaTimes className="h-6 w-6 text-black" />
        ) : (
          <FaBars className="h-6 w-6 text-black" />
        )}
      </button>
      <AdminSearchBar />
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
              <p className="text-md text-gray-700 mb-4">{book.description}</p>

              <div className="flex flex-wrap gap-4 mb-4">
                <p className="text-md font-semibold">Género:</p>
                <p className="text-md text-gray-600">{gender.name}</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <p className="text-lg font-semibold">Disponibles:</p>
                <p className="text-lg text-gray-600">{book.quantity} Unidades</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <p className="text-lg font-semibold">Precio:</p>
                <p className="text-lg text-gray-600">${(book.price / 100).toFixed(2)}</p>
              </div>

              <div className="flex space-x-4 mt-4">
                <AdminEditBookModal selectedGenre={gender.id} bookId={book.id} />
                <DeleteBookButton BookId={book.id} />
              </div>
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
