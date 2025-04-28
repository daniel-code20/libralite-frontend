import { useQuery, gql } from '@apollo/client';
import { CircularProgress } from '@nextui-org/react';
import React from 'react';
import AdminBookList from '../components/AdminBookList';


interface Review {
  id: string;
  rating: number;
  book: {
    id: string;
  };
}

interface Book {
  id: string;
  title: string;
  image: {
    url: string;
  };
  author: {
    name: string;
  };
  price: number;
  description: string;
  gender: {
    id: string;
    name: string;
  };
}

interface Gender {
  id: string;
  name: string;
  image: {
    url: string;
  };
  books: Book[];
}

const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    genders {
      id
      name
      image {
        url
      }
      books {
        id
        title
        image {
          url
        }
        author {
          name
        }
        price
        description
        gender {
          id
          name
        }
      }
    }
  }
`;

const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    reviews {
      id
      rating
      book {
        id
      }
    }
  }
`;

export const AllCategoriesAdmin: React.FC = () => {
  const { loading, error, data } = useQuery<{ genders: Gender[] }>(GET_ALL_CATEGORIES);
  const { loading: loadingReviews, error: errorReviews, data: reviewsData } = useQuery<{ reviews: Review[] }>(GET_ALL_REVIEWS);

  if (loading || loadingReviews) return <CircularProgress label="Cargando categorías..." />;
  if (error) return <p>Error: {error.message}</p>;
  if (errorReviews) return <p>Error: {errorReviews.message}</p>;

  const getRatingForBook = (bookId: string): number | null => {
    const review = reviewsData?.reviews.find(review => review.book.id === bookId);
    return review ? review.rating : null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4 space-y-12">
        {data?.genders.map((category) => (
          <div key={category.id}>
            <AdminBookList
              books={category.books}
              getRatingForBook={getRatingForBook}
              gender={category}
            />
          </div>
        ))}
      </main>
    </div>
  );
};
