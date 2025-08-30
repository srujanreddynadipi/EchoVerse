import React, { useState } from 'react';
import { 
  Home, 
  Phone, 
  Info, 
  Settings, 
  Download, 
  User, 
  LogOut,
  Menu,
  X,
  Sparkles,
  History
} from 'lucide-react';

const Navbar = ({ user, onLogout, currentPage, setCurrentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-2xl sticky top-0 z-50 backdrop-blur-lg border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                EchoVerse
              </h1>
              <p className="text-xs text-purple-300 -mt-1">AI Audiobook Creator</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white shadow-lg backdrop-blur-sm border border-purple-400/30' 
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${isActive ? 'text-purple-300' : 'group-hover:text-purple-300'}`} />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Menu & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-purple-400/30">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-purple-300 text-xs">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-red-400/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-left
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white shadow-lg backdrop-blur-sm border border-purple-400/30' 
                        : 'text-purple-200 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-purple-300' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile User Info & Logout */}
              {user && (
                <div className="pt-4 border-t border-purple-500/20 space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl border border-purple-400/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-purple-300 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-400/30"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
