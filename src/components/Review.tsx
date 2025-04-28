import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { MdDelete } from "react-icons/md";
import { FaStar, FaRegStar } from "react-icons/fa"; // Importamos los íconos de estrellas

const GET_BOOK_DETAILS = gql`
  query Books($id: ID!) {
    books(where: { id: { equals: $id } }) {
      id
      title
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

const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(where: { id: $id }) {
      id
    }
  }
`;

interface User {
  id: string;
  name: string;
}

interface Review {
  id: string;
  comment: string;
  rating: number;
  user: User;
}

interface Book {
  id: string;
  title: string;
  reviews: Review[];
}

interface BooksData {
  books: Book[];
}

interface ReviewProps {
  bookId: string;
  userId: string | null; // El ID del usuario logueado
  isAdmin: boolean; // Indicamos si es un administrador
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <div key={star}>
        {star <= rating ? (
          <FaStar className="w-5 h-5 text-yellow-400" /> // Estrella llena
        ) : (
          <FaRegStar className="w-5 h-5 text-gray-300" /> // Estrella vacía
        )}
      </div>
    ))}
  </div>
);

export const Review = ({ bookId, userId, isAdmin }: ReviewProps) => {
  const { data, loading, error, refetch } = useQuery<BooksData>(GET_BOOK_DETAILS, {
    variables: { id: bookId },
  });

  const [deleteReview] = useMutation(DELETE_REVIEW, {
    onCompleted: () => refetch(), // Volver a cargar las reseñas después de eliminar
  });

  if (loading) return <p>Cargando reseñas...</p>;
  if (error) return <p>Error al cargar reseñas</p>;

  const reviews = data?.books[0]?.reviews ?? [];

  const handleDelete = async (reviewId: string) => {
    await deleteReview({ variables: { id: reviewId } });
  };

  return (
    <div className="w-full mb-4">
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Reseñas</h2>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg p-4 border border-gray-200 w-full flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{review.user.name}</p>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
              {/* El botón para eliminar la reseña se muestra si el usuario logueado es el propietario de la reseña o si es admin */}
              {(review.user.id === userId || isAdmin) && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="ml-4 text-red-600 hover:text-red-800 flex items-center gap-2"
                >
                  <MdDelete /> {/* Icono de basurero */}
                  Borrar {/* Texto junto al icono */}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No hay reseñas disponibles.</p>
      )}
    </div>
  );
};
