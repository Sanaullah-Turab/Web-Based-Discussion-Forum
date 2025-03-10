import React, { useState } from "react";
import { BsGoogle, BsFacebook, BsMicrosoft, BsApple } from "react-icons/bs";

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    window.location.href = " /home ";
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] sm:min-h-screen bg-gray-200 font-['Poppins'] px-5 sm:px-0">
      <div
        className={`relative overflow-hidden w-full max-w-3xl min-h-[480px] bg-white rounded-3xl shadow-lg ${
          isActive ? "active" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div
          className={`absolute top-0 h-full transition-all duration-500 ease-in-out w-1/2 left-0 opacity-0 z-10 
          ${isActive ? "translate-x-full opacity-100 z-50" : ""}`}
        >
          <form className="flex flex-col items-center justify-center h-full px-10 bg-white">
            <h1 className="text-xl font-bold">Create Account</h1>
            <div className="flex my-5">
              <a
                href="#"
                className="inline-flex justify-center items-center m-0 mx-1 w-10 h-10 border border-gray-300 rounded-[20%] transition-opacity duration-300 hover:opacity-50"
              >
                <BsGoogle />
              </a>
              <a
                href="#"
                className="inline-flex justify-center items-center m-0 mx-1 w-10 h-10 border border-gray-300 rounded-[20%] transition-opacity duration-300 hover:opacity-50"
              >
                <BsFacebook />
              </a>
              <a
                href="#"
                className="inline-flex justify-center items-center m-0 mx-1 w-10 h-10 border border-gray-300 rounded-[20%] transition-opacity duration-300 hover:opacity-50"
              >
                <BsMicrosoft />
              </a>
              <a
                href="#"
                className="inline-flex justify-center items-center m-0 mx-1 w-10 h-10 border border-gray-300 rounded-[20%] transition-opacity duration-300 hover:opacity-50"
              >
                <BsApple />
              </a>
            </div>
            <span className="text-xs">Register with E-mail</span>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 my-2 text-sm bg-gray-100 border-none rounded-lg outline-none"
            />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 my-2 text-sm bg-gray-100 border-none rounded-lg outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 my-2 text-sm bg-gray-100 border-none rounded-lg outline-none"
            />
            <button className="px-10 py-2 mt-2 text-xs font-semibold tracking-wider text-white uppercase bg-[#0d1e4c] rounded-lg cursor-pointer border border-transparent">
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full z-20 transition-all duration-500 ease-in-out
          ${isActive ? "translate-x-full" : ""}`}
        >
          <form className="flex flex-col items-center justify-center h-full px-10 bg-white">
            <h1 className="text-xl font-bold">Sign In</h1>
            <div className="flex my-5">
              <a
                href="#"
                className="inline-flex justify-center items-center m-0 mx-1 w-10 h-10 border border-gray-300 rounded-[20%] transition-opacity duration-300 hover:opacity-50"
              >
                <BsGoogle />
              </a>
              <a
                href="#"
                className="inline-flex justify-center items-center m-0 mx-1 w-10 h-10 border border-gray-300 rounded-[20%] transition-opacity duration-300 hover:opacity-50"
              >
                <BsFacebook />
              </a>
              <a
                href="#"
                className="inline-flex justify-center items-center m-0 mx-1 w-10 h-10 border border-gray-300 rounded-[20%] transition-opacity duration-300 hover:opacity-50"
              >
                <BsMicrosoft />
              </a>
              <a
                href="#"
                className="inline-flex justify-center items-center m-0 mx-1 w-10 h-10 border border-gray-300 rounded-[20%] transition-opacity duration-300 hover:opacity-50"
              >
                <BsApple />
              </a>
            </div>
            <span className="text-xs">Login With Email & Password</span>
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 my-2 text-sm bg-gray-100 border-none rounded-lg outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 my-2 text-sm bg-gray-100 border-none rounded-lg outline-none"
            />
            <a
              href="#"
              className="mt-3 mb-2 text-sm text-gray-800 no-underline"
            >
              Forgot Password?
            </a>
            <button
              onClick={handleSignIn}
              className="px-10 py-2 mt-2 text-xs font-semibold tracking-wider text-white uppercase bg-[#122a6b] rounded-lg cursor-pointer border border-transparent"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-500 ease-in-out z-[1000] rounded-2xl
          ${isActive ? "-translate-x-full" : ""}`}
        >
          <div
            className={`bg-[#0d1e4c] text-white relative left-[-100%] h-full w-[200%] transition-all duration-300 ease-in-out
            ${isActive ? "translate-x-1/2" : "translate-x-0"}`}
          >
            {/* Toggle Left Panel */}
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-300 ease-in-out
              ${isActive ? "translate-x-0" : "-translate-x-[200%]"}`}
            >
              <h1 className="text-xl font-bold">Already have an account?</h1>
              <p className="text-sm leading-5 tracking-wide my-5">
                Click here to sign in with ID & Password
              </p>
              <button
                onClick={handleLoginClick}
                className="px-10 py-2 mt-2 text-xs font-semibold tracking-wider text-[#122a6b] bg-white uppercase rounded-lg cursor-pointer border border-white"
              >
                Sign In
              </button>
            </div>

            {/* Toggle Right Panel */}
            <div
              className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-300 ease-in-out
              ${isActive ? "translate-x-0" : ""}`}
            >
              <h1 className="text-xl font-bold">Don't have an account?</h1>
              <p className="text-sm leading-5 tracking-wide my-5">
                Click here to quickly make one!
              </p>
              <button
                onClick={handleRegisterClick}
                className="px-10 py-2 mt-2 text-xs font-semibold tracking-wider text-[#122a6b] bg-white uppercase rounded-lg cursor-pointer border border-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
