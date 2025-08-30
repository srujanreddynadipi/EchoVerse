import React, { useState } from 'react';
import { Menu, X, History, Home, Settings, Info, LogOut, Download, Speaker, Shield } from 'lucide-react';

const Hamburger = ({ onNavigate, currentPage, onLogout, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'voice-info', label: 'Voice Info', icon: Speaker },
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'about', label: 'About', icon: Info }
  ];

  const handleMenuClick = (pageId) => {
    onNavigate(pageId);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleAdminClick = () => {
    setIsOpen(false);
    window.location.href = '/admin-login';
  };

  return (
    <div className="relative z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-8 mt-12">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
              <History className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EchoVerse
            </h2>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* User Info */}
            {user && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="text-sm text-gray-600 mb-3 px-4">
                  Logged in as: <span className="font-medium text-gray-800">{user.name}</span>
                </div>
                
                {/* Admin Access Button */}
                <button
                  onClick={handleAdminClick}
                  className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 mb-2"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  <span className="font-medium">Admin Access</span>
                </button>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4">
              <p className="text-sm text-gray-600 text-center">
                Transform text into expressive audiobooks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hamburger;
