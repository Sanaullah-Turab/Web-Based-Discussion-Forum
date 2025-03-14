import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForumList from "./components/ForumList";
import ForumDetail from "./components/ForumDetail";
import ForumNavigator from "./components/ForumNavigator";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/forums" element={<ForumList />} />
        <Route path="/forums/:forumId" element={<ForumDetail />} />
        <Route path="/forum-navigator" element={<ForumNavigator />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
