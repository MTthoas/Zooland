import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {

 const location = useLocation();

 const headerClass = location.pathname === '/' ? 'bg-transparent' : 'bg-base100  border-b border-bg-base100 shadow-sm';
 const textColor = location.pathname === '/' ? 'text-white' : 'text-black';


  return (
    <footer className={` py-4 w-full fixed bottom-0 z-50 ${headerClass}`}>
      <div className="container mx-auto flex justify-center items-center">
        <p className={`text-sm ${textColor}`}>
          © {new Date().getFullYear()} Zoo Company. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
