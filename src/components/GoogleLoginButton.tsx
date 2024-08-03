import React from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import iconGoogle from '../assets/google-icon.png';
import { Button } from '@nextui-org/button';

const GoogleLoginButton: React.FC = () => {
  const clientId = '760222018286-m4b2mkvbko67rhj3457a7pfse5f2fhtl.apps.googleusercontent.com';

  const handleSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('profileObj' in response) {
      console.log('Login Success:', response);
      // Maneja el éxito del login aquí
    } else {
      console.log('Login Success (offline):', response);
      // Maneja el éxito del login en modo offline aquí
    }
  };

  const handleFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    console.log('Login Failed:', response);
    // Maneja el fallo del login aquí
  };

  return (
    <GoogleLogin
      clientId={clientId}
      render={(renderProps) => (
        <Button
          className="flex items-center max-w-lg bg-black font-semibold text-white border border-gray-400 py-3 px-4 h-12"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
           radius="sm"
           variant='shadow'
        >
          <img src={iconGoogle} alt="Google Icon" className="w-6 h-6 mr-2" />
          Iniciar con Google
        </Button>
      )}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;
