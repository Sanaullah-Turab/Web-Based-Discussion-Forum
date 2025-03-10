import { Link } from "react-router-dom";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import logoImage from "../assets/codeconvo.png";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white px-6 py-3 shadow font-poppins">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logoImage}
            alt="Code Convo Logo"
            className="h-8 sm:h-10 mr-2"
          />
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Code <span className="text-[#122a6b] -ml-2 ">Convo</span>
          </h1>
        </div>

        {/* Right side content */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Navigation links (visible on larger screens) */}
          <div className="hidden sm:flex space-x-6">
            <Link to="/forums" className="text-gray-700 text-lg">
              Forums
            </Link>
            <Link to="/about" className="text-gray-700 text-lg">
              About
            </Link>
          </div>

          {/* User icon and menu button */}
          <div className="flex items-center space-x-2">
            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none pt-2"
              >
                <FiUser className="w-6 h-6 text-gray-700" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden focus:outline-none"
            >
              <HiMenu className="w-7 h-7 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-2 bg-white shadow-md rounded-md border p-4">
          <Link
            to="/forums"
            className="block text-gray-700 text-lg py-2"
            onClick={() => setMenuOpen(false)}
          >
            Forums
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 text-lg py-2"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
