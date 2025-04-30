import React from "react";
import { useQuery, gql } from "@apollo/client";
import AdminCategoryModal from "../../Modal/AdminCategoryModal";
import EditGenderButton from "../../graphql/EditGenderButton";
import DeleteGenderButton from "../../graphql/DeleteGenderButton";
import AdminSideBar from "./AdminSideBar";

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

interface Book {
  id: string;
  title: string;
  image: { url: string };
  author: { name: string };
  price: number;
  description: string;
  gender: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
  image: { url: string };
  books: Book[];
}

const CategoriesTable: React.FC = () => {
  const { loading, error, data } = useQuery<{ genders: Category[] }>(
    GET_ALL_CATEGORIES
  );

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 ">
      <AdminSideBar />
      <div className="flex-grow flex flex-col transition-all duration-300 w-full  ">
        <header className="bg-white shadow flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between sm:pl-16 gap-2 p-4 z-20 lg:ml-60">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
              Gestión de Categorías
            </h1>
          </div>

          {/* Modal se posiciona debajo del título en móviles */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <AdminCategoryModal />
          </div>
        </header>

        {/* Tabla de Categorías */}
        <main className="pt-4 px-4 transition-all duration-300 lg:ml-60">
          <div className="max-w-7xl mx-auto bg-white rounded-md shadow-lg overflow-hidden animate__animated animate__fadeInUp">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto text-xs sm:text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-800 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Libros</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.genders.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 border-b last:border-none"
                    >
                      <td className="px-4 py-3 font-medium">{category.name}</td>
                      <td className="px-4 py-3">
                        <ul className="list-disc ml-5">
                          {category.books.map((book) => (
                            <li key={book.id}>{book.title}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <EditGenderButton gender={category} />
                        <DeleteGenderButton genderId={category.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoriesTable;
