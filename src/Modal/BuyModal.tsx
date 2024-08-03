import { Link } from 'react-router-dom';
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
import Form, { FormItem, FormValidations } from 'reactivity-hook-form';
import React from 'react';
import { gql, useApolloClient } from '@apollo/client';
import Swal from 'sweetalert2';

// Define the mutation to create a purchase
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

type FormValues = {
  postal: string;
  address: string;
  phone: string;
  city: string;
};

const validations: FormValidations<FormValues> = {
  postal: {
    required: 'El código postal es requerido',
  },
  address: {
    required: 'La dirección es requerida',
  },
  phone: {
    required: 'El número de teléfono es requerido',
  },
  city: {
    required: 'La ciudad es requerida',
  },
};

interface BuyModalProps {
  book: { id: string };
  userId: string; // Assuming you pass the userId as a prop
}

const BuyModal: React.FC<BuyModalProps> = ({ book, userId }) => {
  const client = useApolloClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (data: FormValues) => {
    try {
      const { data: purchaseData } = await client.mutate({
        mutation: CREATE_BUY_MUTATION,
        context: {
          headers: {
            'content-type': 'multipart/form-data',
            'x-apollo-operation-name': 'CreateBuyMutation',
            'apollo-require-preflight': true,
          },
        },
        variables: {
          data: {
            postal: data.postal,
            address: data.address,
            phone: data.phone,
            city: data.city,
            book: { connect: { id: book.id } },
            user: { connect: { id: userId } },
          },
        },
      });

      Swal.fire({
        title: '¡Compra exitosa!',
        text: 'La compra se ha registrado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('Error al crear la compra:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al registrar la compra',
        icon: 'error',
      });
    }
  };

  return (
    <>
      <Button
        color="primary"
        variant="shadow"
        radius="sm"
        onPress={onOpen}
        style={{ marginBottom: '20px', marginRight: '20px' }}
      >
        Comprar
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Datos de compra
              </ModalHeader>
              <ModalBody>
                <Form<FormValues>
                  onSubmit={handleSubmit}
                  validations={validations}
                >
                  <FormItem<FormValues> name="postal">
                    <Input
                      type="text"
                      label="Código postal"
                      placeholder="06007"
                      className="w-full p-2 rounded"
                      required
                      variant="bordered"
                    />
                  </FormItem>
                  <FormItem<FormValues> name="address">
                    <Input
                      type="text"
                      label="Dirección"
                      placeholder="Carr. longitudinal del Nte. Km 73.5"
                      className="w-full p-2 rounded"
                      required
                      variant="bordered"
                    />
                  </FormItem>
                  <FormItem<FormValues> name="city">
                    <Input
                      type="text"
                      label="Ciudad"
                      placeholder="San Salvador"
                      className="w-full p-2 rounded"
                      required
                      variant="bordered"
                    />
                  </FormItem>
                  <FormItem<FormValues> name="phone">
                    <Input
                      type="text"
                      label="Teléfono"
                      placeholder="+503 2525-2525"
                      className="w-full p-2 rounded"
                      required
                      variant="bordered"
                    />
                  </FormItem>
                  <Button
                    type="submit"
                    color="primary"
                    radius="sm"
                    variant="shadow"
                    style={{ marginTop: '20px' }}
                  >
                    Confirmar
                  </Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} radius="sm">
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

export default BuyModal;
