import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.js"; // Importing Auth context provider
import HomePage from "./pages/HomePage.jsx"; // Home page component
import AboutPage from "./pages/AboutPage.jsx"; // About page component
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx"; // Uncomment when RegisterPage is implemented
import Header from "./components/Header.jsx"; // Header component
import Footer from "./components/Footer.jsx"; // Footer component
import NotFoundPage from "./pages/NotFoundPage.jsx"; // 404 Not Found page
import ContactPage from "./pages/ContactPage.jsx"; // Contact page
import ProfilePage from "./pages/ProfilePage.jsx"; // Profile page

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
