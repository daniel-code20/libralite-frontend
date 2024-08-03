import { useQuery, gql } from '@apollo/client';
import { CircularProgress } from '@nextui-org/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminBookList from '../components/AdminBookList';
import AdminSideBar from '../components/AdminSideBar';
import AdminBookModal from '../../Modal/AdminBookModal';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AdminSearchBar } from '../components/AdminSearchBar';

interface Genders {
  id: string;
  name: string;
  image: { url: string };
  books: {
    id: string;
    title: string;
    image: { url: string };
    author: { name: string };
    price: number;
    gender: { id: string, name: string };
    description: string;
  }[];
}

interface Review {
  id: string;
  rating: number;
  book: { id: string };
}

const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    reviews {
      rating
      book {
        id
      }
    }
  }
`;

const GET_ALL_GENDERS = gql`
  query Genders($id: ID!) {
    genders(where: { id: { equals: $id } }) {
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

export const AdminCategoryDetail: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_ALL_GENDERS, {
    variables: { id },
  });
  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_ALL_REVIEWS);

  if (loading || reviewsLoading) return <CircularProgress label="Loading..." />;
  if (error) return <p>Error: {error.message}</p>;
  if (reviewsError) return <p>Error: {reviewsError.message}</p>;

  if (!data || !data.genders || data.genders.length === 0) {
    return <p>No data available for this gender.</p>;
  }

  const gender: Genders = data.genders[0];
  const getRatingForBook = (bookId: string) => {
    const review = reviewsData.reviews.find(
      (review: Review) => review.book.id === bookId
    );
    return review ? review.rating : null;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'} lg:ml-60`}>
        <header className="bg-white shadow-md flex items-center justify-between p-4 relative rounded-md z-10">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <FaTimes className="h-6 w-6 text-black" />
            ) : (
              <FaBars className="h-6 w-6 text-black" />
            )}
          </button>
            <h1 className="text-3xl font-bold text-black">{gender.name}</h1>
            <AdminSearchBar />
          <AdminBookModal selectedGenre={gender.id} />
        </header>
        <main className="flex-grow bg-gray-100 p-4 lg:p-8">
          <AdminBookList
            books={gender.books}
            getRatingForBook={getRatingForBook}
          />
        </main>
      </div>
    </div>
  );
};
