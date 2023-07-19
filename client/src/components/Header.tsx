import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function Header({ setShowModalLogin, setShowModalRegister, username }: any) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };


  useEffect(() => {
    if (isLoggedIn) {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      axios.get('/users/' + username, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.error(error);
      });
    } 
}, [isLoggedIn]);



  const headerClass = location.pathname === '/' ? 'bg-transparent' : 'bg-base100 border-b border-bg-base100 shadow-sm';
  const textColor = location.pathname === '/' ? 'text-white' : 'text-black';

  return (
    <header className={`w-full fixed top-0 z-50 ${headerClass}`}>
      <div className="container flex flex-col items-start p-6 mx-auto md:flex-row">
        <Link to="/">
          <div className={`flex text-2xl items-center mb-4 font-bold ${textColor} title-font md:mb-0 hover:underline`}>
            <p>ZooLand</p>
          </div>
        </Link>
        <nav className="flex items-center justify-center text-base md:ml-auto gap-x-4">
          {isLoggedIn && (
            <Link to="/spaces">
              <p className={`mr-5 font-medium ${textColor} mt-2`}>Spaces</p>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/stats">
              <p className={`mr-5 font-medium ${textColor} mt-2`}>Stats</p>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/users">
              <p className={`mr-5 font-medium ${textColor} mt-2`}>Users</p>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/tickets">
              <p className={`mr-5 font-medium ${textColor} mt-2`}>Tickets</p>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/management">
              <p className={`mr-5 font-medium ${textColor} mt-2`}>Management</p>
            </Link>
          )}
          {isLoggedIn ? (
            <details className="dropdown ">
            <summary className="mt-2 btn bg-white hover:bg-white w-32"> Admin </summary>
            <ul className=" p-2 shadow menu dropdown-content z-[1] mt-2 bg-white rounded-box w-48">
              <li><a className="text-black hover:text-black">Profil details</a></li>
              <li><a onClick={()=> handleLogout()} className="text-black hover:text-black">Déconnexion</a></li>
            </ul>
          </details>

          ) : (
            <>
              <p onClick={() => setShowModalLogin(true)} className={`mr-5 font-medium ${textColor} hover:underline text-lg mt-2`}>
                Login
              </p>
              <p onClick={() => setShowModalRegister(true)} className={`mr-5 font-medium ${textColor} hover:underline text-lg mt-2`}>
                Register
              </p>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
