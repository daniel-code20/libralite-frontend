import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import SideBar from "./SideBar";
import { FaBars, FaTimes } from "react-icons/fa";
import { Button } from "@nextui-org/button";
import { FiSliders } from "react-icons/fi";

interface Buy {
  cliente: { email: string; name: string };
  direccionEnvio: string;
  fechaCompra: string;
  libro: { title: string | null };
}

const GET_ALL_BUYS = gql`
  query Buys($clientId: ID!) {
    buys(where: { cliente: { id: { equals: $clientId } } }) {
      cliente {
        id
        email
        name
      }
      direccionEnvio
      fechaCompra
      libro {
        id
        title
      }
    }
  }
`;

export const BuysList: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clientId = localStorage.getItem("userId");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<"latest" | "oldest" | null>(null);

  const { data, loading, error } = useQuery<{ buys: Buy[] }>(GET_ALL_BUYS, {
    variables: { clientId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const applyFilter = (buys: Buy[]) => {
    if (!filter) return buys;
    const sortedBuys = [...buys]; // Crear una copia del array
    return sortedBuys.sort((a, b) => {
      const dateA = new Date(a.fechaCompra).getTime();
      const dateB = new Date(b.fechaCompra).getTime();
      return filter === "latest" ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredBuys = applyFilter(data?.buys || []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <div className="flex-grow flex flex-col transition-all duration-300 w-full">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <header className="bg-white shadow flex items-center justify-between p-4 sticky z-20 lg:ml-60">
          {/* Parte izquierda del header con el botón y el título */}
          <div className="flex items-center space-x-4">
            {/* Botón de menú, solo en pantallas pequeñas */}
            {!sidebarOpen && (
              <button
                className="lg:hidden text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars className="w-6 h-6" />
              </button>
            )}

            {/* Título */}
            <h1 className="text-xl sm:text-2xl font-semibold">Mis Compras</h1>
          </div>

          {/* Parte derecha del header con el botón de ordenamiento */}
          <div className="relative">
            <Button
              className="text-gray-700 flex items-center bg-white border shadow-sm hover:bg-gray-100"
              radius="sm"
              variant="light"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiSliders className="mr-2" />
              {filter === "latest" ? "Más reciente" : "Más antiguo"}
            </Button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-30">
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setFilter("latest");
                    setFilterOpen(false);
                  }}
                >
                  Más reciente
                </button>
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setFilter("oldest");
                    setFilterOpen(false);
                  }}
                >
                  Más antiguo
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="pt-4 px-4 transition-all duration-300 lg:ml-60">
          <div className="max-w-7xl mx-auto bg-white rounded-md shadow-lg overflow-hidden animate__animated animate__fadeInUp">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto text-xs sm:text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-800 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Dirección</th>
                    <th className="px-4 py-3">Fecha de compra</th>
                    <th className="px-4 py-3">Libro</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuys.map((buy: Buy, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 border-b last:border-none"
                    >
                      <td className="px-4 py-3">
                        {buy.cliente.name} ({buy.cliente.email})
                      </td>
                      <td className="px-4 py-3">{buy.direccionEnvio}</td>
                      <td className="px-4 py-3">
                        {new Date(buy.fechaCompra).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {buy.libro ? buy.libro.title : "No Title"}
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
