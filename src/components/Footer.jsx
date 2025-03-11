import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from "react-icons/fa";
import LogoImage from "../assets/codeconvo.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 font-['Poppins']">
      <div className="container mx-auto px-4 md:h-auto h-[120px] overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side - Brand */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <img
                src={LogoImage}
                alt="Code Convo Logo"
                className="h-8 sm:h-10 mr-2"
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Code{" "}
              <span className="text-[#122a6b] -ml-1 md:-ml-1">Convo</span>
              </h1>
            </div>
            <p className="text-gray-600 mt-1">Where People Connect & Share.</p>
          </div>

          {/* Right side - Social Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaDiscord size={24} />
            </a>
          </div>
        </div>

        {/* Bottom section - Copyright & Links */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} CodeConvo. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
