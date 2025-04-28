import React from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Button } from '@nextui-org/react';
import Swal from 'sweetalert2';

const DELETE_BRANCH_MUTATION = gql`
  mutation DeleteBranch($id: ID!) {
    deleteSucursal(where: { id: $id }) {
      id
    }
  }
`;

interface DeleteSucursalButtonProps {
  sucursalId: string;
}

const DeleteSucursalButton: React.FC<DeleteSucursalButtonProps> = ({ sucursalId }) => {
  const client = useApolloClient();

  const handleDelete = async () => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_BRANCH_MUTATION,
        variables: {
          id: sucursalId,
        },
      });

      console.log('Sucursal eliminada:', data);

      Swal.fire({
        title: '¡Excelente!',
        text: 'Sucursal eliminada exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/admin-sucursal'; // O donde sea necesario redirigir
        }
      });
    } catch (error) {
      console.error('Error al eliminar la sucursal:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar la sucursal',
        icon: 'error',
      });
    }
  };

  return (
    <Button
      color="danger"
      className="ml-4 w-full lg:w-auto"
      radius="sm"
      variant="light"
      onClick={handleDelete}
    >
      Eliminar
    </Button>
  );
};

export default DeleteSucursalButton;
