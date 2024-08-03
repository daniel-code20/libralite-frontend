import React from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Button } from '@nextui-org/react';
import Swal from 'sweetalert2';

const DELETE_GENDER_MUTATION = gql`
  mutation DeleteGender($id: ID!) {
    deleteGender(where: { id: $id }) {
      id
      name
    }
  }
`;

interface DeleteGenderButtonProps {
  genderId: string;
}

const DeleteGenderButton: React.FC<DeleteGenderButtonProps> = ({ genderId }) => {
  const client = useApolloClient();

  const handleDelete = async () => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_GENDER_MUTATION,
        variables: {
          id: genderId,
        },
      });

      console.log('Género eliminado:', data);

      Swal.fire({
        title: '¡Excelente!',
        text: 'Género eliminado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('Error al eliminar el género:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar el género',
        icon: 'error',
      });
    }
  };

  return (
    <Button
      color="danger"
      className="ml-4"
      radius="sm"
      variant="flat"
      onClick={handleDelete}
      
    >
      Eliminar
    </Button>
  );
};

export default DeleteGenderButton;
