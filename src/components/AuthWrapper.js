import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import EchoVerse from '../EchoVerse';

const AuthWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedLoginStatus = localStorage.getItem('isLoggedIn');
        
        if (storedUser && storedLoginStatus === 'true') {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Data is already stored in localStorage by the login component
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Data is already stored in localStorage by the register component
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EchoVerse...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show the main EchoVerse app
  if (isLoggedIn && user) {
    return <EchoVerse user={user} onLogout={handleLogout} />;
  }

  // If not logged in, show authentication forms
  if (currentView === 'register') {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onSwitchToLogin={switchToLogin}
      />
    );
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onSwitchToRegister={switchToRegister}
    />
  );
};

export default AuthWrapper;
