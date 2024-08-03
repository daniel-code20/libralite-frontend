import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from '@nextui-org/react';
import { useState, useRef } from 'react';
import React from 'react';
import { gql, useApolloClient } from '@apollo/client';
import Swal from 'sweetalert2';

const CREATE_GENDER_MUTATION = gql`
  mutation CreateGender($data: GenderCreateInput!) {
    createGender(data: $data) {
      id
      name
      image {
        url
      }
    }
  }
`;

const AdminCategoryModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const client = useApolloClient();
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(e.target.files);
      console.log('Imagen seleccionada:', e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedImages || selectedImages.length === 0) {
      alert('Por favor selecciona al menos una imagen');
      return;
    }

    const file = selectedImages[0];  // Asumiendo que solo se sube una imagen

    try {
      const { data } = await client.mutate({
        mutation: CREATE_GENDER_MUTATION,
        context: {
          headers: {
            'content-type': 'multipart/form-data',
            'x-apollo-operation-name': 'CreateGenderMutation',
            'apollo-require-preflight': true,
          },
        },
        variables: {
          data: {
            name: categoryName,
            image: { upload: file },
          },
        },
      });



      Swal.fire({
        title: '¡Excelente!',
        text: 'Género creado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
      setCategoryName('');
      setSelectedImages(null);
      formRef.current?.reset();
    } catch (error) {
      console.error('Error al crear el género:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al crear el género',
        icon: 'error',
      });
    }
  };

  return (
    <>
      <Button
        color="primary" radius="sm" variant="shadow"
        onClick={onOpen}
        className='mt-4 text-white'
      >
        Agregar Género
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar Género</ModalHeader>
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
                      required
                      onChange={handleImageChange}
                    />
                  </div>

                  <Button type="submit" color="primary" radius="sm" variant="shadow" className='mr-4 mt-4 mb-4'>
                    Agregar
                  </Button>
                <Button color="danger" variant="flat" radius="sm" onClick={onClose}>
                  Cancelar
                </Button>
                </form>
              </ModalBody>
       
            
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminCategoryModal;
