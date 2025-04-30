import React, { useState } from 'react';
import Form, { FormItem, FormValidations } from 'reactivity-hook-form';
import { Link } from 'react-router-dom';
import { authenticateUser, UserRoles } from '../auth/authUser';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../assets/read-animation-2.json';
import logoImg from '../assets/Logo1.png';
import { Input } from '@nextui-org/react';
import { EyeFilledIcon } from '../components/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../components/EyeSlashFilledIcon';
import { Button } from '@nextui-org/button';
import 'animate.css';

export const Login = () => {
  type FormValues = {
    email: string;
    password: string;
  };

  const validations: FormValidations<FormValues> = {
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
  };

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const user = await authenticateUser(data.email, data.password);
      localStorage.setItem('userId', user.id);
      if (user.role === UserRoles.ADMIN) {
        navigate('/admin-principal');
      } else {
        navigate('/principal');
      }
    } catch (error) {
      setError('Correo o contraseña inválidos');
    }
  };

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
  <div className="flex h-screen animate__animated animate__fadeIn">
    <div className="hidden md:flex flex-1 justify-center bg-white items-center animate__animated animate__floatAnimation">
      <Lottie animationData={animationData} style={{ width: '70%' }} />
    </div>
    <div className="flex-1 flex justify-center items-center bg-blue-400 p-6 md:p-12">
      <div className="w-full max-w-lg p-6 rounded-md bg-white shadow-2xl">
        <div className="flex items-center text-cyan-400 mb-2">
          <img src={logoImg} alt="logo" className="w-14 mr-3" />
          <h3 className="font-bold bg-gradient-to-tr from-blue-500 to-cyan-400 text-transparent bg-clip-text">
            BookFlow
          </h3>
        </div>
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido a BookFlow!👋</h1>
        <p className="text-gray-500 mb-4 ">
          Inicia sesión para ver nuestro stock disponible y disfruta de los mejores libros.
        </p>
        <Form<FormValues> onSubmit={handleLogin} validations={validations}>
          <FormItem<FormValues> name="email">
            <Input
              type="email"
              label="Email"
              radius="sm"
              variant="flat"
              placeholder="example@google.com"
              className="w-full text-black focus:ring-blue-400 mb-2"
              aria-label="Email"
            />
          </FormItem>
          <FormItem<FormValues> name="password">
            <Input
              label="Contraseña"
              variant="flat"
              placeholder="Ingresa tu contraseña"
              radius="sm"
              type={isVisible ? 'text' : 'password'}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="Toggle password visibility"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              className="w-full text-black focus:ring-blue-400 mb-2"
            />
          </FormItem>
          <Button
            variant="shadow"
            radius="sm"
            className="w-full bg-black text-white h-12 font-semibold mb-2"
            type="submit"
          >
            Iniciar sesión
          </Button>
          {error && (
            <p className="text-red-500 mt-4 bg-red-100 p-2 rounded-md text-sm">
              {error}
            </p>
          )}
        </Form>
        <p className="mt-4 flex items-center justify-center text-sm">
          <span className="text-gray-700">¿No tienes una cuenta?</span>
          <Link to="/signup" className=" font-medium ml-2">
            Crear Cuenta
          </Link>
        </p>
      </div>
    </div>
  </div>
</>

  );
};
