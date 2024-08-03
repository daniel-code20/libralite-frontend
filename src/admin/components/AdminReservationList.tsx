import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import AdminSideBar from './AdminSideBar';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiSliders } from "react-icons/fi";
import { Button } from '@nextui-org/button';

interface Reservation {
    user: { email: string, name: string };
    sucursal: { name: string };
    reservationDate: string;
    book: { title: string | null };
}

const GET_ALL_RESERVATION = gql`
   query Reservations {
    reservations {
      user {
        id
        email
        name
      }
      book {
        id
        title
      }
      sucursal {
        name
      }
      cantidad
      reservationDate
    }
  }
`;

export const AdminReservationList: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState<'latest' | 'oldest' | null>(null);

    const { data, loading, error } = useQuery<{ reservations: Reservation[] }>(GET_ALL_RESERVATION);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const applyFilter = (reservations: Reservation[]) => {
        if (!filter) return reservations;
        const sortedReservations = [...reservations]; // Crear una copia del array
        return sortedReservations.sort((a, b) => {
            const dateA = new Date(a.reservationDate).getTime();
            const dateB = new Date(b.reservationDate).getTime();
            return filter === 'latest' ? dateB - dateA : dateA - dateB;
        });
    };

    const filteredReservations = applyFilter(data?.reservations || []);

    return (
        <>
            <div className="flex min-h-screen bg-gray-100 overflow-y-auto">
                <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'} lg:ml-60`}>
                    <header className="bg-white shadow-md flex items-center p-4 ml-4 mr-4">
                        <button
                            className="lg:hidden p-2 text-black"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>
                        <h1 className="text-2xl font-bold ml-4">Reservaciones</h1>
                        <div className="relative">
                            <Button
                                className="text-black font-semibold flex items-center justify-center bg-white ml-2"
                                radius="sm"
                                variant='light'
                                onClick={() => setFilterOpen(!filterOpen)}
                            >
                                <FiSliders className="inline-block mr-2" />
                                Filtrar
                            </Button>
                            {filterOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                                    <button
                                        className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left"
                                        onClick={() => setFilter('latest')}
                                    >
                                        Más reciente
                                    </button>
                                    <button
                                        className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left"
                                        onClick={() => setFilter('oldest')}
                                    >
                                        Más antiguo
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>
                    <main className="flex-grow p-4 overflow-y-auto">
                        <div className="w-full max-w-[1200px] mx-auto bg-white rounded-md shadow-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b border-gray-700 text-left">Usuario</th>
                                            <th className="py-2 px-4 border-b border-gray-700 text-left">Sucursal</th>
                                            <th className="py-2 px-4 border-b border-gray-700 text-left">Fecha de compra</th>
                                            <th className="py-2 px-4 border-b border-gray-700 text-left">Libro</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReservations.map((reservation: Reservation, index: number) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 border-b border-gray-700">{reservation.user.name} ({reservation.user.email})</td>
                                                <td className="py-2 px-4 border-b border-gray-700">{reservation.sucursal.name}</td>
                                                <td className="py-2 px-4 border-b border-gray-700">{new Date(reservation.reservationDate).toLocaleDateString()}</td>
                                                <td className="py-2 px-4 border-b border-gray-700">{reservation.book ? reservation.book.title : 'No Title'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};
