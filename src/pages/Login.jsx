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
    <div className="relative min-h-[95vh] sm:min-h-screen bg-gray-200 font-['Poppins'] px-5 sm:px-0 pt-12 md:pt-6 overflow-x-hidden overflow-y-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] sm:min-h-screen md:pb-10">
        {/* Heading Section */}
        <div className="text-center mb-8 md:mb-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0d1e4c] mb-4 leading-tight">
            A Web Based Discussion Forum Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-600 animate-fade-in">
            Where People Connect & Share Ideas
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
            <div className="h-1 w-10 bg-purple-500 rounded-full"></div>
            <div className="h-1 w-5 bg-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* Original Login Container */}
        <div
          className={`relative overflow-hidden w-full max-w-3xl min-h-[480px] bg-white rounded-3xl shadow-lg md:pb-10 ${
            isActive ? "active" : ""
          }`}
        >
          {/* Sign Up Form */}
          <div
            className={`absolute top-0 h-full transition-all duration-500 ease-in-out w-1/2 left-0 opacity-0 z-10 
            ${isActive ? "translate-x-full opacity-100 z-50" : ""}`}
          >
            <form className="flex flex-col items-center justify-center h-full px-3 md:px-10 bg-white">
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
            <form className="flex flex-col items-center justify-center h-full px-3 md:px-10 bg-white">
              <h1 className="text-xl font-bold ">Sign in</h1>
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

      {/* Add required styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-in;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
