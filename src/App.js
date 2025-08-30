import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuthWrapper from "./components/AuthWrapper";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/*" element={
            <>
              <AuthWrapper />
              <Chatbot />
              <div className="flex justify-center mb-4">
                <button 
                  onClick={() => window.location.href = '/admin-login'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Admin Login
                </button>
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}