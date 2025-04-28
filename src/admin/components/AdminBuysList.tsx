import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import AdminSideBar from "./AdminSideBar";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiSliders } from "react-icons/fi";
import { Button } from "@nextui-org/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Buy {
  id: string;
  cliente: { email: string; name: string };
  direccionEnvio: string;
  codigoPostal: string;
  ciudad: string;
  telefono: string;
  cantidad: number;
  estadoEnvio: string;
  fechaCompra: string;
  libro: { title: string | null };
}

const GET_ALL_BUYS = gql`
  query Buys {
    buys {
      id
      cliente {
        email
        name
      }
      direccionEnvio
      codigoPostal
      ciudad
      telefono
      cantidad
      estadoEnvio
      fechaCompra
      libro {
        title
      }
    }
  }
`;

const UPDATE_ESTADO_ENVIO = gql`
  mutation UpdateEstadoEnvio($id: ID!, $estadoEnvio: String!) {
    updateBuy(where: { id: $id }, data: { estadoEnvio: $estadoEnvio }) {
      id
      estadoEnvio
    }
  }
`;

export const AdminBuysList: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<"latest" | "oldest" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error, refetch } = useQuery<{ buys: Buy[] }>(
    GET_ALL_BUYS
  );
  const [updateEstadoEnvio] = useMutation(UPDATE_ESTADO_ENVIO);

  const handleEstadoChange = async (id: string, newEstado: string) => {
    await updateEstadoEnvio({ variables: { id, estadoEnvio: newEstado } });
    refetch();
  };

  const applyFilter = (buys: Buy[]) => {
    if (!filter) return buys;
    const sortedBuys = [...buys];
    return sortedBuys.sort((a, b) => {
      const dateA = new Date(a.fechaCompra).getTime();
      const dateB = new Date(b.fechaCompra).getTime();
      return filter === "latest" ? dateB - dateA : dateA - dateB;
    });
  };

  const applySearch = (buys: Buy[]) => {
    return buys.filter(
      (buy) =>
        buy.cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buy.cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "Usuario",
          "Dirección",
          "Ciudad",
          "Código Postal",
          "Teléfono",
          "Cantidad",
          "Estado Envío",
          "Fecha",
          "Libro",
        ],
      ],
      body: filteredBuys.map((buy) => [
        `${buy.cliente.name} (${buy.cliente.email})`,
        buy.direccionEnvio,
        buy.ciudad,
        buy.codigoPostal,
        buy.telefono,
        buy.cantidad,
        buy.estadoEnvio,
        new Date(buy.fechaCompra).toLocaleDateString(),
        buy.libro?.title || "No Title",
      ]),
    });
    doc.save("compras.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredBuys.map((buy) => ({
        Usuario: `${buy.cliente.name} (${buy.cliente.email})`,
        Dirección: buy.direccionEnvio,
        Ciudad: buy.ciudad,
        CódigoPostal: buy.codigoPostal,
        Teléfono: buy.telefono,
        Cantidad: buy.cantidad,
        EstadoEnvío: buy.estadoEnvio,
        FechaCompra: new Date(buy.fechaCompra).toLocaleDateString(),
        Libro: buy.libro?.title || "No Title",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Compras");
    XLSX.writeFile(workbook, "compras.xlsx");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredBuys = applySearch(applyFilter(data?.buys || []));

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`flex-grow flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-60" : "ml-0"
        } lg:ml-60`}
      >
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
              Gestión de Compras
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={exportPDF}
              color="primary"
              size="sm"
              className="shadow-md"
            >
              Exportar PDF
            </Button>
            <Button
              onClick={exportExcel}
              color="success"
              size="sm"
              className="shadow-md"
            >
              Exportar Excel
            </Button>
            <Button
              className="text-gray-700 flex items-center bg-white border shadow-sm hover:bg-gray-100"
              radius="sm"
              variant="light"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiSliders className="mr-2" />
              Ordenar
            </Button>
            {filterOpen && (
              <div className="absolute right-4 top-20 w-48 bg-white border rounded shadow-lg z-30">
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => setFilter("latest")}
                >
                  Más reciente
                </button>
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => setFilter("oldest")}
                >
                  Más antiguo
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow p-4">
          <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-800 font-medium">
                  <tr>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Dirección</th>
                    <th className="px-4 py-3">Ciudad</th>
                    <th className="px-4 py-3">Código Postal</th>
                    <th className="px-4 py-3">Teléfono</th>
                    <th className="px-4 py-3">Cantidad</th>
                    <th className="px-4 py-3">Fecha Compra</th>
                    <th className="px-4 py-3">Libro</th>
                    <th className="px-4 py-3">Estado Envío</th>
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
                      <td className="px-4 py-3">{buy.ciudad}</td>
                      <td className="px-4 py-3">{buy.codigoPostal}</td>
                      <td className="px-4 py-3">{buy.telefono}</td>
                      <td className="px-4 py-3">{buy.cantidad}</td>
                      <td className="px-4 py-3">
                        {new Date(buy.fechaCompra).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {buy.libro?.title || "No Title"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="border px-2 py-1 rounded-md bg-white"
                          value={buy.estadoEnvio}
                          onChange={(e) =>
                            handleEstadoChange(buy.id, e.target.value)
                          }
                        >
                          <option value="PENDIENTE">🟡 Pendiente</option>
                          <option value="EN_PROCESO">🔵 En Proceso</option>
                          <option value="ENVIADO">🟣 Enviado</option>
                          <option value="ENTREGADO">🟢 Entregado</option>
                        </select>
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
