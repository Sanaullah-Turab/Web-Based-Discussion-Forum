import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { FiLogOut, FiUser } from "react-icons/fi";
import logoImage from "../assets/codeconvo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  const isAboutPage = location.pathname === '/about';
  const isLoggedInPage = isHomePage || isAboutPage;

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/');
  };

  return (
    <nav className="bg-white px-6 py-3 shadow font-[Poppins]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title - Clickable to go home */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img
            src={logoImage}
            alt="Code Convo Logo"
            className="h-8 sm:h-10 mr-2"
          />
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Code <span className="text-[#365cc4] -ml-[6px] md:-ml-1 ">Convo</span>
          </h1>
        </Link>

        {/* Right side content */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Navigation links (visible on larger screens) */}
          {isLoggedInPage && (
            <div className="hidden sm:flex space-x-6">
              <Link to="/about" className="text-gray-700 text-lg">
                About
              </Link>
            </div>
          )}

          {/* User icon/logout button and mobile menu */}
          <div className="flex items-center space-x-2">
            {isLoggedInPage ? (
              // Logout button for home and about pages
              <button
                onClick={handleLogout}
                className="focus:outline-none p-2 hover:bg-red-50 rounded-full transition-colors"
              >
                <FiLogOut className="w-6 h-6 text-red-600" />
              </button>
            ) : (
              // User dropdown for login/signup pages
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="focus:outline-none pt-2"
                >
                  <FiUser className="w-6 h-6 text-gray-700" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
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
            )}

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
          {isLoggedInPage && (
            <>
              <Link
                to="/about"
                className="block text-gray-700 text-lg py-2"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
