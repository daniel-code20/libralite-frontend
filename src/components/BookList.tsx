import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Para las estrellas

interface Book {
  id: string;
  title: string;
  author: { name: string };
  image: { url: string };
  price: number;
  description: string;
  gender: { name: string };
  reviews: { rating: number }[]; // Asegúrate de que las reseñas estén disponibles
}

interface BookListProps {
  books: Book[];
  getRatingForBook: (bookId: string) => number | null;
}

const BookList: React.FC<BookListProps> = ({ books, getRatingForBook }) => {
  // Función para renderizar estrellas según el rating
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

  return (
    <div className="flex flex-col items-start justify-start animate__animated animate__fadeIn shadow-md bg-white rounded-md w-full overflow-hidden">
      <div className="px-4 w-full">
        {books.length > 0 && (
          <h1 className="text-2xl font-bold text-black mt-4 mb-2">
            {books[0].gender.name}
          </h1>
        )}

        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-4 gap-x-2 mb-8">
            {books.map((book) => {
              const rating = getRatingForBook(book.id); // Obtener el rating del libro
              const averageRating = rating || 0; // Si no hay rating, poner 0

              return (
                <Link key={book.id} to={`/book/${book.id}`}>
                  <Card
                    className="w-full bg-white shadow-md flex flex-col lg:flex-row transition duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                    radius="sm"
                  >
                    <CardBody className="flex justify-center items-center lg:w-1/3 p-3">
                      <Image
                        className="object-cover w-full h-40"
                        radius="none"
                        alt={book.title}
                        src={book.image.url}
                      />
                    </CardBody>
                    <CardFooter className="px-3 py-2 lg:w-2/3 flex flex-col">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-sm text-black">
                          {book.title}
                        </h4>
                        <h5 className="text-xs font-semibold text-gray-600">
                          {book.author?.name || "Autor desconocido"}
                        </h5>
                        {/* Mostrar las estrellas del rating */}
                        <div className="flex items-center gap-2">
                          {renderStars(averageRating)}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-4">
                          {book.description}
                        </p>
                        <small className="text-sm font-bold text-black">
                          ${(book.price / 100).toFixed(2)}
                        </small>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-400 mt-6">
            No hay libros disponibles en este género.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookList;
