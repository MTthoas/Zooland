import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfilDetails from "../pages/ProfilDetails";
import axios from "axios";

function Header({ setShowModalLogin, setShowModalRegister }: any) {
  const [UsernameConst, setUsernameConst] = React.useState("");
  const [dataUser, setDataUser] = React.useState({} as any);

  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    if (isLoggedIn && location.pathname !== '/ticketuser') {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      axios
        .get("/users/" + username, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);

          setUsernameConst(String(username));
          setDataUser(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isLoggedIn]);

  const headerClass =
    location.pathname === "/"
      ? "bg-transparent"
      : "bg-base100 border-b border-bg-base100";
  const textColor = location.pathname === "/" ? "text-white" : "text-black";

  return (
    <header className={`w-full fixed top-0 z-50 ${headerClass}`}>
      <div className="container flex flex-col items-start p-6 mx-auto md:flex-row">
        <Link to="/">
          <div
            className={`flex text-2xl items-center font-bold ${textColor} title-font md:mb-0 mt-2 hover:underline`}
          >
            <p>ZooLand</p>
          </div>
        </Link>
        <nav className="flex items-center justify-center text-base md:ml-auto gap-x-4">
          {isLoggedIn && (
            <Link to="/spaces">
              <p className={`mr-5 font-medium ${textColor} mt-1`}>Spaces</p>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/stats">
              <p className={`mr-5 font-medium ${textColor} mt-1`}>Stats</p>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/users">
              <p className={`mr-5 font-medium ${textColor} mt-1`}>Users</p>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/tickets">
              <p className={`mr-5 font-medium ${textColor} mt-1`}>Tickets</p>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/management">
              <p className={`mr-5 font-medium ${textColor} mt-1`}>Management</p>
            </Link>
          )}
          {isLoggedIn ? (
            <details className="dropdown ">
              <summary className=" btn bg-base100 hover:bg-gray-100 w-24 h-10 min-h-8 border-gray-500 text-black mt-2">
                {" "}
                {UsernameConst}{" "}
              </summary>
              <ul className=" p-2 shadow menu dropdown-content z-[1] mt-2 bg-white rounded-box w-48">
                <li>
                <Link
                      to={`/users/${UsernameConst}`}
                      className="text-black hover:text-black"
                    >
                      Profil details
                    </Link>
                </li>
                <li>
                  <a
                    onClick={() => handleLogout()}
                    className="text-black hover:text-black"
                  >
                    Déconnexion
                  </a>
                </li>
              </ul>
            </details>
          ) : (
            <>
              <p
                onClick={() => setShowModalLogin(true)}
                className={`mr-5 font-medium ${textColor} hover:underline text-lg mt-2`}
              >
                Login
              </p>
              <p
                onClick={() => setShowModalRegister(true)}
                className={`mr-5 font-medium ${textColor} hover:underline text-lg mt-2`}
              >
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
