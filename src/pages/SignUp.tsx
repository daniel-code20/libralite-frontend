import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import Form, { FormItem, FormValidations } from 'reactivity-hook-form';
import Lottie from 'lottie-react';
import animationData from '../assets/sign-up.json';
import { Input } from '@nextui-org/react';
import { EyeFilledIcon } from '../components/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../components/EyeSlashFilledIcon';
import { Button } from '@nextui-org/button';
import logoImg from '../assets/Logo1.png';
import { useUser } from '../provider/userProvider';

const CREATE_USER_MUTATION = gql`
  mutation CREATE_USER_MUTATION($name: String!, $email: String!, $password: String!) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
    }
  }
`;

export const SignUp = () => {
  type FormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const validations: FormValidations<FormValues> = {
    name: {
      required: 'El nombre es requerido',
    },
    email: {
      required: 'El email es requerido',
    },
    password: {
      required: 'La contraseña es requerida',
      validate(value) {
        if (value.length < 8) {
          return 'La contraseña debe tener al menos 8 caracteres';
        }
      },
    },
    confirmPassword: {
      required: 'Debes confirmar la contraseña',
      validate(value, values) {
        if (value !== values.password) {
          return 'Las contraseñas no coinciden';
        }
      },
    },
  };

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUserId } = useUser();

  const [createUser] = useMutation(CREATE_USER_MUTATION);

  const handleSignUp = async (data: FormValues) => {
    const { name, email, password } = data;
    try {
      const response = await createUser({
        variables: { name, email, password },
      });
      const userId = response.data.createUser.id;
      localStorage.setItem('userId', userId);
      setUserId(userId);
      navigate('/principal');
    } catch (error) {
      setError('Error al crear la cuenta');
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex h-screen overflow-hidden animate__animated animate__fadeIn">
      <div className="flex-1 flex justify-center items-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-lg shadow-2xl p-4 rounded-md">
          <div className="flex items-center text-cyan-400 mb-6">
            <img src={logoImg} alt="logo" className="w-11 mr-3" />
            <h3 className="font-bold bg-gradient-to-tr from-blue-500 to-cyan-400 text-transparent bg-clip-text loading-noreal">LibraLite</h3>
          </div>
          <h1 className="text-2xl font-bold mb-4">Crear Cuenta</h1>
          <p className="text-black mb-6">
            Crea una cuenta para ver nuestro stock disponible y disfruta de los mejores libros
          </p>
          <Form<FormValues> onSubmit={handleSignUp} validations={validations}>
            <FormItem<FormValues> name="name">
              <Input
                type="text"
                label="Nombre"
                variant="flat"
                radius="sm"
                className="w-full text-black drop-shadow-md"
              />
            </FormItem>
            <FormItem<FormValues> name="email">
              <Input
                type="email"
                label="Email"
                radius="sm"
                variant="flat"
                placeholder="example@google.com"
                className="w-full text-black drop-shadow-md"
              />
            </FormItem>
            <FormItem<FormValues> name="password">
              <Input
                label="Contraseña"
                variant="flat"
                radius="sm"
                placeholder="Ingresa tu contraseña"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                className="w-full text-black drop-shadow-md"
              />
            </FormItem>
            <FormItem<FormValues> name="confirmPassword">
              <Input
                label="Confirma tu contraseña"
                variant="flat"
                radius="sm"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                className="w-full text-black drop-shadow-md"
              />
            </FormItem>
            {error && <p>{error}</p>}
            <Button
              radius="sm"
              className="w-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white shadow-lg h-12"
              type="submit"
            >
              Crear Cuenta
            </Button>
            {error && <p>{error}</p>}
          </Form>
          <p className="mt-4 flex items-center">
            <span className="text-black">¿Ya tienes una cuenta?</span>
            <Link to="/login" className="bg-gradient-to-tr from-blue-500 to-cyan-400 text-transparent bg-clip-text loading-noreal ml-2">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:flex flex-1 justify-center items-center animate__animated animate__floatAnimation">
        <Lottie animationData={animationData} style={{ width: '70%' }} />
      </div>
    </div>
  );
};
