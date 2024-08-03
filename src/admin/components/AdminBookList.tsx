import React from 'react';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Divider, Image } from '@nextui-org/react';
import estrella from '../../assets/estrella (1).png';
import { Genders } from '../../graphql/types';
import { GET_ALL_GENDERS } from '../../graphql/mutation/queries';
import AdminEditBookModal from '../../Modal/AdminEditBookModal';
import DeleteBookButton from '../../graphql/DeleteBookButton';

interface Book {
  id: string;
  title: string;
  author: { name: string };
  image: { url: string };
  price: number;
  gender: { id: string, name: string }
  description: string;
}

interface BookListProps {
  books: Book[];
  getRatingForBook: (bookId: string) => number | null;
}

const AdminBookList: React.FC<BookListProps> = ({ books, getRatingForBook }) => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_ALL_GENDERS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.genders || data.genders.length === 0) {
    return <p>No data available for this gender.</p>;
  }

  const gender: Genders = data.genders[0];

  return (
    <div className="flex flex-col items-start justify-start animate__animated animate__fadeIn shadow-md bg-white rounded-md w-full overflow-hidden">
      <div className="px-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black mt-4">Libros</h1>
        </div>
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Link key={book.id} to={`/admin-book/${book.id}`}>
                <Card className="w-full max-w-[340px] mx-auto bg-white mb-6 shadow-xl flex flex-col lg:flex-row" radius="sm">
                  <CardBody className="flex justify-center items-center lg:w-1/3 lg:items-start lg:pr-4">
                    <Image
                      className="object-cover w-full h-40"
                      radius="md"
                      alt={book.title}
                      src={book.image.url}
                    />
                  </CardBody>
                  <CardFooter className="p-4 lg:w-2/3 flex flex-col">
                    <div className="flex flex-col mb-2">
                      <h4 className="font-bold text-base text-black mb-1">
                        {book.title}
                      </h4>
                      <h5 className="text-xs font-regular text-gray-600 mb-1">
                        {book.author?.name || 'Autor desconocido'}
                      </h5>
                      <p className="text-xs font-regular text-gray-600 line-clamp-2 mb-1">
                        {book.description}
                      </p>
                      <small className="text-sm font-bold text-black">
                        ${(book.price / 100).toFixed(2)}
                      </small>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-400 mt-8">No hay libros disponibles en este género.</p>
        )}
      </div>
    </div>

  );
};

export default AdminBookList;
