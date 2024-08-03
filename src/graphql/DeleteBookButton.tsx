import React from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Button } from '@nextui-org/react';
import Swal from 'sweetalert2';

const DELETE_BOOk_MUTATION = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(where: { id: $id }) {
      id
    }
  }
`;

interface DeleteBookButtonProps {
  BookId: string;
}

const DeleteBookButton: React.FC<DeleteBookButtonProps> = ({ BookId }) => {
  const client = useApolloClient();

  const handleDelete = async () => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_BOOk_MUTATION,
        variables: {
          id: BookId,
        },
      });

      console.log('Libro eliminado eliminado:', data);

      Swal.fire({
        title: '¡Excelente!',
        text: 'Libro eliminado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/admin-principal'; 
        }
      });
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar el libro',
        icon: 'error',
      });
    }
  };

  return (
    <Button
      color="danger"
      className="ml-4 w-full lg:w-auto"
      radius="sm"
      variant="flat"
      onClick={handleDelete}
      
    >
      Eliminar
    </Button>
  );
};

export default DeleteBookButton;
