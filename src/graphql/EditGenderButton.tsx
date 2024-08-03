import React, { useState, useRef, useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from '@nextui-org/react';
import Swal from 'sweetalert2';

// Definición de interfaz para el objeto Gender
interface Gender {
  id: string;
  name: string;
  image: {
    url: string;
  };
}

const UPDATE_GENDER_MUTATION = gql`
  mutation UpdateGender($id: ID!, $data: GenderUpdateInput!) {
    updateGender(where: { id: $id }, data: $data) {
      id
      name
      image {
        url
      }
    }
  }
`;

const EditGenderButton: React.FC<{ gender: Gender }> = ({ gender }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categoryName, setCategoryName] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const client = useApolloClient();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (gender) {
      setCategoryName(gender.name);
    }
  }, [gender]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(e.target.files);
      console.log('Imagen seleccionada:', e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!gender || !selectedImages || selectedImages.length === 0) {
      alert('Por favor selecciona una categoría y al menos una imagen');
      return;
    }

    const file = selectedImages[0];  // Asumiendo que solo se sube una imagen

    try {
      const { data } = await client.mutate({
        mutation: UPDATE_GENDER_MUTATION,
        context: {
          headers: {
            'content-type': 'multipart/form-data',
            'x-apollo-operation-name': 'UpdateGenderMutation',
            'apollo-require-preflight': true,
          },
        },
        variables: {
          id: gender.id,
          data: {
            name: categoryName,
            image: { upload: file },
          },
        },
      });

      Swal.fire({
        title: '¡Excelente!',
        text: 'Género actualizado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      })

      setCategoryName('');
      setSelectedImages(null);
      formRef.current?.reset();
    } catch (error) {
      console.error('Error al actualizar el género:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al actualizar el género',
        icon: 'error',
      });
    }
  };

  return (
    <>
      <Button
        color="primary"
        radius="sm"
        variant="shadow"
        onClick={() => {
          onOpen();
          setCategoryName(gender.name);
        }}
      >
        Actualizar
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Actualizar Género</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} ref={formRef}>
              <div>
                <label>Nombre</label>
                <Input
                  type="text"
                  className="w-full p-2 rounded"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              <div>
                <label>Imagen</label>
                <input
                  type="file"
                  className="w-full p-2 rounded"
                  required={!gender.image}  // Si la imagen ya está presente, no se requiere seleccionar otra
                  onChange={handleImageChange}
                />
              </div>

              <Button type="submit" color="primary" radius="sm" variant="shadow" className='mr-4 mt-4 mb-4'>
                Actualizar
              </Button>
            <Button color="danger" variant="flat" radius="sm" onClick={onClose}>
              Cancelar
            </Button>
            </form>
          </ModalBody>
          
          
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditGenderButton;
