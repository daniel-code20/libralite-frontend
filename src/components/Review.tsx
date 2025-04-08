import React from "react";
import { useQuery, gql } from "@apollo/client";

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
}

export const Review = ({ bookId }: ReviewProps) => {
  const { data, loading, error } = useQuery<BooksData>(GET_BOOK_DETAILS, {
    variables: { id: bookId },
  });

  if (loading) return <p>Cargando reseñas...</p>;
  if (error) return <p>Error al cargar reseñas</p>;

  const reviews = data?.books[0]?.reviews ?? [];

  return (
    <div className="w-full mb-4">
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Reseñas</h2>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 w-full"
            >
              <p className="font-semibold text-gray-900">{review.user.name}</p>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No hay reseñas disponibles.</p>
      )}
    </div>
  );
};
