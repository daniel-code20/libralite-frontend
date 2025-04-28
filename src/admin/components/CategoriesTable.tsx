import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { FaBars, FaTimes } from "react-icons/fa";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
  {/* Sidebar */}
  <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

  {/* Main Content */}
  <div
    className={`flex-grow flex flex-col transition-all duration-300 ${
      sidebarOpen ? "ml-60" : "ml-0"
    } lg:ml-60`}
  >
    {/* Header */}
    <header className="bg-white shadow flex items-center justify-between p-4 sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <button
          className="lg:hidden text-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
        <h1 className="text-xl sm:text-2xl font-semibold">
          Gestión de Categorías
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <AdminCategoryModal />
      </div>
    </header>

    {/* Tabla de Categorías */}
    <main className="flex-grow p-4">
      <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 font-medium">
              <tr>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Libros</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.genders.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 border-b last:border-none">
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
