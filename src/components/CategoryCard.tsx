import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from '@nextui-org/react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import React from 'react';

interface Genders {
  id: string;
  name: string;
  image: { id: string; url: string };
}

const GET_ALL_BOOKS = gql`
  query Genders {
    genders {
      id
      name
      image {
        id
        url
      }
    }
  }
`;

export const CategoryCard = () => {
  const { data, loading, error } = useQuery(GET_ALL_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-start justify-start animate__animated animate__fadeIn shadow-md bg-white rounded-md w-full overflow-hidden">
      <div className="px-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black mt-4">Géneros</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.genders.map((item: Genders) => (
            <Card
              className="w-full max-w-[300px] mx-auto drop-shadow-xl mb-6"
              key={item.id}
            >
              <Link to={`/category/${item.id}`}>
                <CardHeader className="flex gap-3">
                  <Image
                    alt="category image"
                    height={40}
                    radius="sm"
                    src={item.image.url ? item.image.url : 'No image'}
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-lg text-black line-clamp-2">
                      {item.name ? item.name : 'No Category'}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-lg text-black">
                    Make beautiful websites regardless of your design
                    experience.
                  </p>
                </CardBody>
              </Link>
              <Divider />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
