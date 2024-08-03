import DropDown from '../components/DropDown';
import { Input } from '@nextui-org/react';
import React, { useState } from 'react';
import Form, { FormItem, FormValidations } from 'reactivity-hook-form';
import Swal from 'sweetalert2';
import { formatISO } from 'date-fns';

interface PaymentFormProps {
  children?: React.ReactNode;
  onSubmit: (formData: FormValues) => void;
}

export type FormValues = {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  phone: string;
  reservationDate: string;
  sucursal: string;
};

const validations: FormValidations<FormValues> = {
  cardNumber: {
    required: 'El número de tarjeta es requerido',
    pattern: {
      value: /^\d{16}$/,
      message: 'El número de tarjeta debe tener 16 dígitos',
    },
  },
  cardName: {
    required: 'El nombre en la tarjeta es requerido',
  },
  expiryDate: {
    required: 'La fecha de expiración es requerida',
    pattern: {
      value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      message: 'La fecha de expiración debe estar en el formato MM/AA',
    },
  },
  cvv: {
    required: 'El CVV es requerido',
    pattern: {
      value: /^\d{3}$/,
      message: 'El CVV debe tener 3 caracteres',
    },
  },
  phone: {
    required: 'El teléfono es requerido',
    pattern: {
      value: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      message: 'El número de teléfono no es válido',
    },
  },
  reservationDate: {
    required: 'La fecha limite para retirar el libro es requerida',
  },
  sucursal: {
    required: 'La sucursal es requerida',
  },
};

export const ReservationForm: React.FC<PaymentFormProps> = ({
  children,
  onSubmit,
}) => {
  const [selectedSucursal, setSelectedSucursal] = useState<string>('');

  const handleSubmit = (data: FormValues) => {
    const reservationDateISO = formatISO(new Date(data.reservationDate));
    const formDataWithISODate = { ...data, reservationDate: reservationDateISO, sucursal: selectedSucursal };

    Swal.fire({
      title: '¡Reserva completada!',
      text: 'Tu reserva ha sido registrada exitosamente.',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/principal';
      }
    });
    console.log('Payment Information:', formDataWithISODate);
    onSubmit(formDataWithISODate);
  };

  const handleSelectSucursal = (sucursal: string) => {
    setSelectedSucursal(sucursal);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validations={validations}
      className="p-6 rounded-lg w-full max-w-md shadow-lg"
      style={{ backgroundColor: 'rgb(255, 255, 255)' }}
    >
      <div className="mb-2">
        <h2 className="text-xl font-bold text-black">Información de pago</h2>
        <FormItem name="cardNumber">
          <Input
            type="text"
            label="Número de Tarjeta"
            className="w-full p-2 rounded text-black"
            required
            variant="bordered"
            radius="sm"
          />
        </FormItem>
        <div className="flex space-x-4">
          <FormItem name="expiryDate" className="w-1/2">
            <Input
              type="text"
              label="Fecha de Expiración"
              placeholder="MM/AA"
              className="w-full p-2 rounded text-black"
              required
              variant="bordered"
              radius="sm"
            />
          </FormItem>
          <FormItem name="cvv" className="w-1/2">
            <Input
              type="text"
              label="CVV"
              className="w-full p-2 rounded text-black"
              required
              variant="bordered"
              radius="sm"
            />
          </FormItem>
        </div>
      </div>
      <div className="mb-2">
        <h2 className="text-xl font-bold text-black">
          Información de contacto
        </h2>

        <div className="flex space-x-4">
          <FormItem<FormValues> name="reservationDate">
            <Input
              type="date"
              label="Fecha de retiro"
              className="w-full p-2 rounded"
              radius="sm"
              required
              variant="bordered"
              min={getTodayDate()}
            />
          </FormItem>
          <FormItem name="phone" className="w-1/2">
            <Input
              type="text"
              label="Teléfono"
              placeholder="+503 2525-2525"
              className="w-full p-2 rounded text-black"
              required
              variant="bordered"
              radius="sm"
            />
          </FormItem>
        </div>
      </div>

      <DropDown onSelectSucursal={handleSelectSucursal} />

      {children}
    </Form>
  );
};
