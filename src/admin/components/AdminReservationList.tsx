import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import AdminSideBar from "./AdminSideBar";
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<"latest" | "oldest" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error, refetch } = useQuery<{
    reservations: Reservation[];
  }>(GET_ALL_RESERVATIONS);
  const [updateReservationStatus] = useMutation(UPDATE_RESERVATION_STATUS);

  const filterRef = useRef<HTMLDivElement | null>(null);

  // Función para cerrar el filtro cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        reservation.user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
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
        FechaReserva: new Date(
          reservation.reservationDate
        ).toLocaleDateString(),
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

  const filteredReservations = applySearch(
    applyFilter(data?.reservations || [])
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 flex-col lg:flex-row">
      <AdminSideBar />
      <div className="flex-grow flex flex-col transition-all duration-300 w-full">
        <header className="bg-white shadow flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between sm:pl-16 gap-2 p-4 z-20 lg:ml-60">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <h1 className="text-lg sm:text-xl font-semibold">
              Gestión de Reservaciones
            </h1>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            />

            <Button
              onClick={exportPDF}
              color="primary"
              size="sm"
              className="shadow-md text-sm px-3"
            >
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>

            <Button
              onClick={exportExcel}
              color="success"
              size="sm"
              className="shadow-md text-sm px-3"
            >
              <span className="hidden sm:inline">Exportar Excel</span>
              <span className="sm:hidden">Excel</span>
            </Button>

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
          </div>
        </header>

        <main className="pt-4 px-4 transition-all duration-300 lg:ml-60">
          <div className="max-w-7xl mx-auto bg-white rounded-md shadow-lg overflow-hidden animate__animated animate__fadeInUp">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto text-xs sm:text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-800 font-medium uppercase tracking-wider">
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
                  {filteredReservations.map(
                    (reservation: Reservation, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 border-b last:border-none"
                      >
                        <td className="px-4 py-3">
                          {reservation.user.name} ({reservation.user.email})
                        </td>
                        <td className="px-4 py-3">
                          {reservation.sucursal.name}
                        </td>
                        <td className="px-4 py-3">{reservation.cantidad}</td>
                        <td className="px-4 py-3">
                          {new Date(
                            reservation.reservationDate
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {reservation.book?.title || "No Title"}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className="border px-2 py-1 rounded-md bg-white text-sm"
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
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
