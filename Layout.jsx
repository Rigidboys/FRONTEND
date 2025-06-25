import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <header className="gradient-bg text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-shield-alt text-2xl" />
            <h1 className="text-xl font-bold">고객 관리 시스템</h1>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition"
            >
              로그아웃
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-200 text-center py-2">
        © 2025 CRM System | NetAND
      </footer>
    </div>
  );
}
