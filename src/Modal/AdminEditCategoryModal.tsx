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
import React, { useState, useEffect, useRef } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import Form, { FormItem, FormValidations } from 'reactivity-hook-form';

type FormValues = {
  name: string;
  image: FileList | null;
};

type Book = {
  id: string;
  title: string;
};

const validations: FormValidations<FormValues> = {
  name: {
    required: 'El nombre de la categoría es requerido',
  },
  image: {
    required: 'La imagen es requerida',
  },
};

const GET_CATEGORY_QUERY = gql`
  query GetCategory($id: ID!) {
    category(where: { id: $id }) {
      id
      name
      image {
        url
      }
      books {
        id
        title
      }
    }
  }
`;

const GET_BOOKS_QUERY = gql`
  query GetBooks {
    books {
      id
      title
    }
  }
`;

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($where: CategoryWhereUniqueInput!, $data: CategoryUpdateInput!) {
  updateCategory(where: $where, data: $data) {
    name
    books {
      title
      image {
        url
      }
    }
    image {
      url
    }
  }
}
`;

type AdminEditCategoryModalProps = {
  categoryId: string;
};

const AdminEditCategoryModal: React.FC<AdminEditCategoryModalProps> = ({ categoryId }) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<FileList | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [categoryImageUrl, setCategoryImageUrl] = useState<string | null>(null);
  const client = useApolloClient();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await client.query({ query: GET_BOOKS_QUERY });
      setBooks(data.books);
    };

    fetchBooks();
  }, [client]);

  useEffect(() => {
    if (isOpen) {
      const fetchCategory = async () => {
        const { data } = await client.query({ query: GET_CATEGORY_QUERY, variables: { id: categoryId } });
        const category = data.category;
        setCategoryName(category.name);
        setSelectedBooks(category.books.map((book: Book) => book.id));
        setCategoryImageUrl(category.image?.url || null);
      };

      fetchCategory();
    }
  }, [client, categoryId, isOpen]);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions: string[] = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedBooks(selectedOptions);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCategoryImage(e.target.files);
    }
  };

  const handleRemoveBook = (bookId: string) => {
    setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
  };

  const handleSubmit = async (data: FormValues) => {
    if (!categoryImage || categoryImage.length === 0) {
      alert('Por favor selecciona al menos una imagen');
      return;
    }

    const image = categoryImage[0]; // Asumiendo que solo se sube una imagen

    try {
      const result = await client.mutate({
        mutation: UPDATE_CATEGORY_MUTATION,
        variables: {
          id: categoryId,
          data: {
            name: data.name,
            image: { upload: image },
            books: {
              connect: selectedBooks.map((id) => ({ id })),
            },
          },
        },
      });

      if (result) {
        console.error('Error al realizar la mutación:', result);
        alert('Error al actualizar la categoría');
        return;
      }

      alert('Categoría actualizada exitosamente');
      setCategoryName('');
      setCategoryImage(null);
      setSelectedBooks([]);
      formRef.current?.reset();
    } catch (error) {
      console.error('Error al realizar la mutación:', error);
      alert('Error al actualizar la categoría');
    }

    
  };

  return (
    <>
      <Button
        color="success"
        variant="shadow"
        radius="sm"
        onPress={onOpen}
        style={{ marginBottom: '20px' }}
      >
        Editar Categoría
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Categoria
              </ModalHeader>
              <ModalBody>
                <Form<FormValues>
                  onSubmit={handleSubmit}
                  validations={validations}
                  ref={formRef}
                >
                  <FormItem<FormValues> name="name">
                    <Input
                      type="text"
                      label="Nombre"
                      className="w-full p-2 rounded"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      variant="bordered"
                    />
                  </FormItem>

                  <div>
                    <label>Libros</label>
                    <select
                      multiple
                      className="w-full p-2 rounded"
                      onChange={handleBookChange}
                      value={selectedBooks}
                    >
                      {books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title}
                        </option>
                      ))}
                    </select>
                    <div>
                      {selectedBooks.map((bookId) => {
                        const book = books.find((b) => b.id === bookId);
                        return (
                          <div key={bookId} className="flex items-center">
                            <span>{book?.title}</span>
                            <Button
                              color="danger"
                              variant="light"
                              onPress={() => handleRemoveBook(bookId)}
                            >
                              X
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

               
                    <input
                      type="file"
                      className="w-full p-2 rounded"
                      onChange={handleImageChange}
                      required
                    />
                    {categoryImageUrl && (
                      <img src={categoryImageUrl} alt="Imagen de la categoría" className="mt-2" />
                    )}
       

                  <Button type="submit" color="primary" radius="md" variant="shadow">
                    Guardar
                  </Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminEditCategoryModal;
