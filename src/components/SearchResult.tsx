import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const SEARCH_BOOKS = gql`
  query Books($where: BookWhereInput!) {
    books(where: $where) {
      id
      title
      author {
        name
      }
    }
  }
`;

interface SearchResultProps {
  searchTerm: string;
}

interface Book {
  id: string;
  title: string;
}

export const SearchResult: React.FC<SearchResultProps> = ({ searchTerm }) => {
  const { loading, error, data } = useQuery(SEARCH_BOOKS, {
    variables: {
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { author: { name: { contains: searchTerm } } },
        ],
      },
    },
  });

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  if (loading) return <div className="p-4 text-gray-700">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  if (!data || !data.books || !Array.isArray(data.books) || data.books.length === 0) {
    return <div className="p-4 text-gray-700">No se encontraron resultados</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg max-h-60 overflow-auto">
      <Listbox aria-label="Resultados de búsqueda">
        {data.books.map((book: Book) => (
          <ListboxItem
            key={book.id}
            className="p-4 border-b border-gray-200 hover:bg-gray-100"
          >
            <Link
              to={`/book/${book.id}`}
              onClick={() => setSelectedBookId(book.id)}
              className="text-blue-600 hover:underline"
            >
              {book.title}
            </Link>
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
};
