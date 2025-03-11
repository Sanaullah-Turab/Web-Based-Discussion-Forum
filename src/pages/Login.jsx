import React, { useState, useEffect } from "react";
import { BsGoogle, BsFacebook, BsMicrosoft, BsApple } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Auth states
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch CSRF token on component mount
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      console.log("Fetching CSRF token...");
      const response = await fetch("http://localhost:8000/auth/csrf/", {
        method: "GET",
        credentials: "include", // Include cookies for CSRF
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();
      console.log("CSRF token response:", data); // Log to see the structure

      // Try different possible field names
      const token = data.csrf_token || data.csrfToken || data.token;
      console.log("Using CSRF token:", token);
      setCsrfToken(token);
    } catch (err) {
      console.error("Error fetching CSRF token:", err);
      setError("Server connection error. Please try again later.");
    }
  };

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.tokens.access);
      localStorage.setItem("refreshToken", data.tokens.refresh);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
        })
      );

      // Redirect to home page
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userData = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
    };

    console.log("Submitting registration with data:", {
      ...userData,
      password: "********", // Hide actual password in logs
    });
    console.log("CSRF Token being used:", csrfToken);

    try {
      // Try with standard URL first
      let response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(userData),
      }).catch(async () => {
        // If that fails, try with trailing slash
        console.log("First attempt failed, trying with trailing slash");
        return await fetch("http://localhost:8000/auth/register/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(userData),
        });
      });

      if (!response) {
        throw new Error("Network request failed");
      }

      console.log("Registration response status:", response.status);

      const data = await response.json();
      console.log("Registration response data:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || JSON.stringify(data) || "Registration failed"
        );
      }

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.tokens.access);
      localStorage.setItem("refreshToken", data.tokens.refresh);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
        })
      );

      // Redirect to home page
      navigate("/home");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[95vh] sm:min-h-screen bg-gray-200 font-['Poppins'] px-5 sm:px-0 pt-12 md:pt-6 overflow-x-hidden overflow-y-hidden">
      {/* Error message display */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-50">
          {error}
        </div>
      )}

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

        {/* Login Container */}
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
            <form
              onSubmit={handleSignUp}
              className="flex flex-col items-center justify-center h-full px-3 md:px-10 bg-white"
            >
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
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full p-3 my-2 text-sm bg-gray-100 border-none rounded-lg outline-none"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 my-2 text-sm bg-gray-100 border-none rounded-lg outline-none"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-2 mt-2 text-xs font-semibold tracking-wider text-white uppercase bg-[#0d1e4c] rounded-lg cursor-pointer border border-transparent disabled:bg-gray-400"
              >
                {loading ? "Please wait..." : "Sign Up"}
              </button>
            </form>
          </div>

          {/* Sign In Form */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full z-20 transition-all duration-500 ease-in-out
            ${isActive ? "translate-x-full" : ""}`}
          >
            <form
              onSubmit={handleSignIn}
              className="flex flex-col items-center justify-center h-full px-3 md:px-10 bg-white"
            >
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
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 my-2 text-sm bg-gray-100 border-none rounded-lg outline-none"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <a
                href="#"
                className="mt-3 mb-2 text-sm text-gray-800 no-underline"
              >
                Forgot Password?
              </a>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-2 mt-2 text-xs font-semibold tracking-wider text-white uppercase bg-[#122a6b] rounded-lg cursor-pointer border border-transparent disabled:bg-gray-400"
              >
                {loading ? "Please wait..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Overlay container */}
          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-500 ease-in-out z-[1000] rounded-2xl
            ${isActive ? "-translate-x-full" : ""}`}
          >
            <div
              className={`bg-[#0d1e4c] text-white relative left-[-100%] h-full w-[200%] transition-all duration-300 ease-in-out
              ${isActive ? "translate-x-1/2" : "translate-x-0"}`}
            >
              {/* Left panel */}
              <div
                className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-300 ease-in-out
                ${isActive ? "translate-x-0" : "-translate-x-[200%]"}`}
              >
                <h1 className="text-xl font-bold">Already have an account?</h1>
                <p className="text-sm leading-5 tracking-wide my-5">
                  Click here to sign in with ID & Password
                </p>
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="px-10 py-2 mt-2 text-xs font-semibold tracking-wider text-[#122a6b] bg-white uppercase rounded-lg cursor-pointer border border-white"
                >
                  Sign In
                </button>
              </div>

              {/* Right panel */}
              <div
                className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-300 ease-in-out
                ${isActive ? "translate-x-0" : ""}`}
              >
                <h1 className="text-xl font-bold">Don't have an account?</h1>
                <p className="text-sm leading-5 tracking-wide my-5">
                  Click here to quickly make one!
                </p>
                <button
                  type="button"
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

      {/* Add required animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
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
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
