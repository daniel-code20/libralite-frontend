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

type FormValues = {
  sucursal: string;
  reservationDate: Date;
};

const validations: FormValidations<FormValues> = {
  sucursal: {
    required: 'La sucursal es requerida',
  },
  reservationDate: {
    required: 'La fecha limite para retirar el libro es requerida',
  },
};

interface ReservationModalProps {
  book: { id: string };
}

const ReservationModal: React.FC<ReservationModalProps> = ({ book }) => {
  const handleSubmit = (data: FormValues) => {
    console.log('Reservation Information:', data);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        variant="ghost"
        radius="sm"
        onClick={onOpen}
        style={{ marginBottom: '20px', marginRight:'20px' }}
      >
        Reservar
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Datos de Reservación
              </ModalHeader>
              <ModalBody>
                <Form<FormValues>
                  onSubmit={handleSubmit}
                  validations={validations}
                >
                  <FormItem<FormValues> name="sucursal">
                    <Input
                      type="text"
                      label="Sucursal"
                      className="w-full p-2 rounded "
                      required
                      variant="bordered"
                    />
                  </FormItem>
                  <FormItem<FormValues> name="reservationDate">
                    <Input
                      type="date"
                      label="Fecha limite para retirar"
                      className="w-full p-2 rounded"
                      required
                      variant="bordered"
                    />
                  </FormItem>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} radius='sm'>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  radius="sm"
                  variant="shadow"
                  onClick={onClose}
                >
                  <Link
                    to={`/reservation/${book.id}`}
                    key={`reservation-${book.id}`}
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Confirmar
                  </Link>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReservationModal;
