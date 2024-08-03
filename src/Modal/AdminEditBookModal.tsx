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
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { gql, useApolloClient, useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const GET_BOOK_QUERY = gql`
  query GetBook($id: ID!) {
    book(where: { id: $id }) {
      id
      title
      description
      edition
      author {
        name
      }
      quantity
      price
      image {
        url
      }
      gender {
        id
        name
      }
    }
  }
`;

const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBook($id: ID!, $data: BookUpdateInput!) {
    updateBook(where: { id: $id }, data: $data) {
      id
      title
      description
      edition
      author {
        name
      }
      quantity
      price
      image {
        url
      }
      gender {
        id
        name
      }
    }
  }
`;

interface AdminEditBookModalProps {
  bookId: string;
  selectedGenre: string;
}

const AdminEditBookModal: React.FC<AdminEditBookModalProps> = ({ bookId, selectedGenre }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<FileList | null>(null);
  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    edition: '',
    author: '',
    quantity: '',
    price: '0.00',
    gender: '', // Guardamos el ID del género seleccionado
  });
  const client = useApolloClient();
  const formRef = useRef<HTMLFormElement>(null);

  const { data: bookDataFetched } = useQuery(GET_BOOK_QUERY, {
    variables: { id: bookId },
    skip: !isOpen, // No hacer la consulta hasta que el modal esté abierto
  });

  useEffect(() => {
    if (bookDataFetched) {
      const book = bookDataFetched.book;
      setBookData({
        title: book.title || '',
        description: book.description || '',
        edition: book.edition?.toString() || '',
        author: book.author?.name || '',
        quantity: book.quantity?.toString() || '',
        price: book.price?.toString() || '',
        gender: book.gender?.id || '',
      });
    }
  }, [bookDataFetched]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files);
      console.log('Imagen seleccionada:', e.target.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'quantity' && (parseFloat(value) <= 0)) {
      return; // No actualiza el estado si la cantidad es menor o igual a cero
    }
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [updateBook] = useMutation(UPDATE_BOOK_MUTATION);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedImage || selectedImage.length === 0) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const file = selectedImage[0]; // Asumimos que solo se sube una imagen

    const priceInCents = Math.round(parseFloat(bookData.price) * 100);

    if (parseInt(bookData.quantity, 10) <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }
  

    try {
      const { data } = await client.mutate({
        mutation: UPDATE_BOOK_MUTATION,
        context: {
          headers: {
            'content-type': 'multipart/form-data',
            'x-apollo-operation-name': 'UpdateBookMutation',
            'apollo-require-preflight': true,
          },
        },
        variables: {
          id: bookId,
          data: {
            title: bookData.title,
            description: bookData.description,
            edition: parseInt(bookData.edition, 10),
            quantity: parseInt(bookData.quantity, 10),
            price: priceInCents,
            gender: { connect: { id: selectedGenre } }, // ID como string
            image: { upload: file },
          },
        },
      });

      Swal.fire({
        title: '¡Excelente!',
        text: 'Libro actualizado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      })
      setBookData({
        title: '',
        description: '',
        edition: '',
        author: '',
        quantity: '',
        price: '0.00',
        gender: selectedGenre, // Limpiar el estado del libro después de actualizarlo
      });
      setSelectedImage(null);
      formRef.current?.reset();
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al actualizar el libro',
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
        onClick={onOpen}
        className="w-full lg:w-auto"
      >
        Actualizar
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Actualizar Libro</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit} ref={formRef}>
                  <div>
                    <label>Título</label>
                    <Input
                      type="text"
                      className="w-full p-2 rounded"
                      name="title"
                      value={bookData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Descripción</label>
                    <Input
                      type="text"
                      className="w-full p-2 rounded"
                      name="description"
                      value={bookData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Edición</label>
                    <Input
                      type="number"
                      className="w-full p-2 rounded"
                      name="edition"
                      value={bookData.edition}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label>Autor</label>
                    <Input
                      type="text"
                      className="w-full p-2 rounded"
                      name="author"
                      value={bookData.author}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Cantidad</label>
                    <Input
                      type="number"
                      className="w-full p-2 rounded"
                      name="quantity"
                      value={bookData.quantity}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label>Precio</label>
                    <Input
                      type="number"
                      step="0.01"
                      className="w-full p-2 rounded"
                      name="price"
                      value={bookData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
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

                  <Button
                    type="submit"
                    color="primary"
                    radius="sm"
                    variant="shadow"
                    className="mr-4 mt-4 mb-4"
                  >
                    Actualizar
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

export default AdminEditBookModal;
