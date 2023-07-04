import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
    return (
            <header className="w-full mt-5 text-gray-700 bg-white shadow-sm body-font pb-3 mb-3">
            <div className="container flex flex-col items-start p-6 mx-auto md:flex-row">
                <div className="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0">
                    <p>ZooLand</p>
                </div>
                <nav className="flex items-center justify-center text-base md:ml-auto">
                    <Link to="/">
                    <p className="mr-5 font-medium hover:text-gray-900">Home</p>
                    </Link>
                    <Link to="/spaces">
                    <p className="mr-5 font-medium hover:text-gray-900">Spaces</p>
                    </Link>
                    <p className="mr-5 font-medium hover:text-gray-900">Register</p>
                    <Link to="/login">
                    <p className="mr-5 font-medium hover:text-gray-900">Login</p>
                    </Link>
                </nav>
        </div>
        </header>
    );
}

export default Header;