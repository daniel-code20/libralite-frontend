import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql, useApolloClient } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { PaymentForm, FormValues } from '../forms/PaymentForm';
import { Button } from '@nextui-org/react';
import Swal from 'sweetalert2';
import SideBar from '../components/SideBar';
import { UPDATE_BOOK_STOCK_MUTATION } from '../graphql/mutation/queries';
import { FaBars, FaTimes } from 'react-icons/fa';

const GET_BOOK_DETAILS = gql`
  query Books($id: ID!) {
    books(where: { id: { equals: $id } }) {
      id
      title
      author {
        name
      }
      image {
        url
      }
      price
      quantity
    }
  }
`;

const CREATE_BUY_MUTATION = gql`
  mutation Buy($data: BuyCreateInput!) {
    createBuy(data: $data) {
      id
      codigoPostal
      ciudad
      telefono
      direccionEnvio
      libro {
        id
      }
      cliente {
        id
      }
    }
  }
`;

interface BookDetails {
  id: string;
  title: string;
  author: { name: string };
  image: { url: string };
  price: number;
  quantity: number;
}

interface BuyPageProps {
  userId: string;
}

export const BuyPage: React.FC<BuyPageProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<{ books: BookDetails[] }>(GET_BOOK_DETAILS, {
    variables: { id },
  });
  const client = useApolloClient();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const selectedBook = localStorage.getItem('selectedBook');
    if (selectedBook) {
      const parsedSelectedBook = JSON.parse(selectedBook);
      setSelectedQuantity(parsedSelectedBook.quantity);
    }
  }, []);

  useEffect(() => {
    if (data && data.books.length > 0) {
      const totalPrice = data.books[0].price * selectedQuantity;
      setTotal(totalPrice);
    }
  }, [data, selectedQuantity]);

  const handleSubmit = async (formData: FormValues) => {
    try {
      if (!userId) throw new Error('User ID is required');

      const { data } = await client.mutate({
        mutation: CREATE_BUY_MUTATION,
        variables: {
          data: {
            codigoPostal: formData.postal,
            ciudad: formData.city,
            telefono: formData.phone,
            direccionEnvio: formData.address,
            libro: { connect: { id: book.id } },
            cliente: { connect: { id: userId } },
          },
        },
      });

      await client.mutate({
        mutation: UPDATE_BOOK_STOCK_MUTATION,
        variables: {
          id: book.id,
          quantity: book.quantity - selectedQuantity,
        },
      });

      console.log('Purchase created:', data);

      Swal.fire({
        title: '¡Compra realizada!',
        text: 'Tu compra ha sido registrada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/principal';
        }
      });
    } catch (error) {
      console.error('Error creating purchase:', error);

      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al registrar tu compra. Por favor, intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || data.books.length === 0) {
    return <p>No se encontraron detalles del libro.</p>;
  }
  const book = data.books[0];

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-y-auto">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'} lg:ml-60`}>
        <header className="bg-white shadow-md flex items-center justify-between p-4 relative rounded-md ml-4 mr-4">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <FaTimes className="h-6 w-6 text-black" />
            ) : (
              <FaBars className="h-6 w-6 text-black" />
            )}
          </button>
            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
        </header>
        <main className="flex-grow flex items-center justify-center p-4 overflow-x-auto">
          <div className="max-w-lg w-full"> {/* Asegura un ancho máximo para el contenido */}
            <PaymentForm onSubmit={handleSubmit}>
              <div className="flex items-start space-x-1">
                <p className="text-lg mb-2 font-bold text-black">Total de unidades:</p>
                <p className="text-lg mb-2 font-semibold text-black">{selectedQuantity}</p>
              </div>
              <Button
                type="submit"
                radius="sm"
                className="w-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white shadow-lg font-bold"
                style={{ height: '50px' }}
              >
                Pagar ${ (total / 100).toFixed(2) }
              </Button>
            </PaymentForm>
          </div>
        </main>
      </div>
    </div>
  );
};
