import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import Calculator from "./pages/Calculator.jsx";
import AppHome from "./pages/AppHome.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BackgroundVideo from "./components/BackgroundVideo.jsx";
import VideoLesson from "./pages/VideoLesson.jsx";

export default function App() {
  return (
    <BrowserRouter>
      {/* GLOBAL VIDEO BACKGROUND */}
      <BackgroundVideo />

      {/* APP CONTENT */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/app" element={<AppHome />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lesson" element={<VideoLesson />} />
      </Routes>
    </BrowserRouter>
  );
}
