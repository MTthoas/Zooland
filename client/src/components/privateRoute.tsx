import React, { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrivateComponentProps {
  children: ReactElement;
}

function PrivateComponent({ children }: PrivateComponentProps) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return token ? children : null;
}

export default PrivateComponent;
