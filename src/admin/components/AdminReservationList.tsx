import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import AdminSideBar from "./AdminSideBar";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiSliders } from "react-icons/fi";
import { Button } from "@nextui-org/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Reservation {
  id: string;
  user: { email: string; name: string };
  sucursal: { name: string };
  cantidad: number;
  reservationDate: string;
  status: string;
  book: { title: string | null };
}

const GET_ALL_RESERVATIONS = gql`
  query Reservations {
    reservations {
      id
      user {
        email
        name
      }
      sucursal {
        name
      }
      cantidad
      reservationDate
      status
      book {
        title
      }
    }
  }
`;

const UPDATE_RESERVATION_STATUS = gql`
  mutation UpdateReservationStatus($id: ID!, $status: String!) {
    updateReservation(where: { id: $id }, data: { status: $status }) {
      id
      status
    }
  }
`;

export const AdminReservationList: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<"latest" | "oldest" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error, refetch } = useQuery<{ reservations: Reservation[] }>(GET_ALL_RESERVATIONS);
  const [updateReservationStatus] = useMutation(UPDATE_RESERVATION_STATUS);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateReservationStatus({ variables: { id, status: newStatus } });
    refetch();
  };

  const applyFilter = (reservations: Reservation[]) => {
    if (!filter) return reservations;
    const sortedReservations = [...reservations];
    console.log("Aplicando filtro:", filter);
    return sortedReservations.sort((a, b) => {
      const dateA = new Date(a.reservationDate).getTime();
      const dateB = new Date(b.reservationDate).getTime();
      return filter === "latest" ? dateB - dateA : dateA - dateB;
    });
  };

  const applySearch = (reservations: Reservation[]) => {
    return reservations.filter(
      (reservation) =>
        reservation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "Usuario",
          "Sucursal",
          "Cantidad",
          "Fecha de Reserva",
          "Estado",
          "Libro",
        ],
      ],
      body: filteredReservations.map((reservation) => [
        `${reservation.user.name} (${reservation.user.email})`,
        reservation.sucursal.name,
        reservation.cantidad,
        new Date(reservation.reservationDate).toLocaleDateString(),
        reservation.status,
        reservation.book?.title || "No Title",
      ]),
    });
    doc.save("reservaciones.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredReservations.map((reservation) => ({
        Usuario: `${reservation.user.name} (${reservation.user.email})`,
        Sucursal: reservation.sucursal.name,
        Cantidad: reservation.cantidad,
        FechaReserva: new Date(reservation.reservationDate).toLocaleDateString(),
        Estado: reservation.status,
        Libro: reservation.book?.title || "No Title",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservaciones");
    XLSX.writeFile(workbook, "reservaciones.xlsx");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredReservations = applySearch(applyFilter(data?.reservations || []));

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
              Gestión de Reservaciones
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
                    <th className="px-4 py-3">Sucursal</th>
                    <th className="px-4 py-3">Cantidad</th>
                    <th className="px-4 py-3">Fecha Reserva</th>
                    <th className="px-4 py-3">Libro</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation: Reservation, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 border-b last:border-none"
                    >
                      <td className="px-4 py-3">
                        {reservation.user.name} ({reservation.user.email})
                      </td>
                      <td className="px-4 py-3">{reservation.sucursal.name}</td>
                      <td className="px-4 py-3">{reservation.cantidad}</td>
                      <td className="px-4 py-3">
                        {new Date(reservation.reservationDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {reservation.book?.title || "No Title"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="border px-2 py-1 rounded-md bg-white"
                          value={reservation.status}
                          onChange={(e) =>
                            handleStatusChange(reservation.id, e.target.value)
                          }
                        >
                          <option value="PENDING">🟡 Pendiente</option>
                          <option value="CONFIRMED">🟢 Confirmada</option>
                          <option value="CANCELLED">🔴 Cancelada</option>
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
