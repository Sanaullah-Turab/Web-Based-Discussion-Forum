import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-[Poppins]">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-800 opacity-20"></div>
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              About <span className="text-blue-600">CodeConvo</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Your Ultimate Platform for Code Discussions and Knowledge Sharing
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* What is CodeConvo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is CodeConvo?</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            CodeConvo is a dynamic web-based discussion forum designed specifically for developers, programmers, and tech enthusiasts. It provides a collaborative space where you can engage in meaningful discussions about coding, share your knowledge, and learn from others in the tech community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Connect</h3>
              <p className="text-gray-600">Join a community of passionate developers and tech enthusiasts.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Learn</h3>
              <p className="text-gray-600">Share knowledge and learn from experienced developers.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Grow</h3>
              <p className="text-gray-600">Enhance your skills through meaningful discussions and feedback.</p>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Discussions</h3>
                  <p className="text-gray-600">Engage in real-time discussions with fellow developers.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Code Sharing</h3>
                  <p className="text-gray-600">Share and discuss code snippets with syntax highlighting.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
                  <p className="text-gray-600">Build connections with developers worldwide.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                  <p className="text-gray-600">Get instant notifications for new discussions and replies.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Credits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Credits</h2>
          <div className="space-y-6">
            {/* First User */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <FiUser className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-700">Muhammad Shayan</span>
              </div>
              <a 
                href="https://github.com/iamshayan40" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mt-2 sm:mt-0"
              >
                <FaGithub className="w-5 h-5" />
                <span className="text-md">@iamshayan40</span>
              </a>
            </div>

            {/* Second User */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <FiUser className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-700">Muhammad Soban Akram</span>
              </div>
              <a 
                href="https://github.com/SOBAN7AKRAM" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mt-2 sm:mt-0"
              >
                <FaGithub className="w-5 h-5" />
                <span className="text-md">@SOBAN7AKRAM</span>
              </a>
            </div>

            {/* Third User */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <FiUser className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-700">Sanaullah Turab</span>
              </div>
              <a 
                href="https://github.com/Sanaullah-Turab" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mt-2 sm:mt-0"
              >
                <FaGithub className="w-5 h-5" />
                <span className="text-md">@Sanaullah-Turab</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
