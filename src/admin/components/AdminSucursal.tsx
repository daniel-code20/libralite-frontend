import React from "react";
import { useQuery, gql } from "@apollo/client";
import AdminSucursalModal from "../../Modal/AdminSucursalModal";
import DeleteSucursalButton from "../../graphql/DeleteSucursalButton";
import AdminSideBar from "./AdminSideBar";

const GET_ALL_SUCURSALS = gql`
  query Sucursals {
    sucursals {
      id
      name
      address
      city
      postal
    }
  }
`;

interface Sucursal {
  id: string;
  name: string;
  address: string;
  city: string;
  postal: string;
}

export const AdminSucursal: React.FC = () => {
  const { loading, error, data } = useQuery<{ sucursals: Sucursal[] }>(
    GET_ALL_SUCURSALS
  );

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <div className="flex-grow flex flex-col transition-all duration-300 w-full">
          <AdminSideBar />
        <header className="bg-white shadow flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between sm:pl-16 gap-2 p-4  z-20 lg:ml-60">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
              Gestión de Sucursales
            </h1>
          </div>

          {/* Modal se posiciona debajo del título en móviles */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <AdminSucursalModal />
          </div>
        </header>

        {/* Tabla de Sucursales */}
        <main className="pt-4 px-4 transition-all duration-300 lg:ml-60">
          <div className="max-w-7xl mx-auto bg-white rounded-md shadow-lg overflow-hidden animate__animated animate__fadeInUp">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto text-xs sm:text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-800 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Sucursal</th>
                    <th className="px-4 py-3">Dirección</th>
                    <th className="px-4 py-3">Ciudad</th>
                    <th className="px-4 py-3">Código Postal</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.sucursals.map((sucursal) => (
                    <tr
                      key={sucursal.id}
                      className="hover:bg-gray-50 border-b last:border-none"
                    >
                      <td className="px-4 py-3 font-medium">{sucursal.name}</td>
                      <td className="px-4 py-3">{sucursal.address}</td>
                      <td className="px-4 py-3">{sucursal.city}</td>
                      <td className="px-4 py-3">{sucursal.postal}</td>
                      <td className="px-4 py-3 space-x-2">
                        <DeleteSucursalButton sucursalId={sucursal.id} />
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
