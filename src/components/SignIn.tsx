import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import { Button } from 'react-bootstrap';

const SignIn: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
    });
  };

  return (
    <Button variant="outline-light" onClick={handleLogin}>Sign In</Button>
  );
};

export default SignIn;
