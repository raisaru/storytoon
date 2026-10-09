import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Shield, Sparkles, LogOut, X, Heart } from 'lucide-react';
import API_URL from '../api';

// Centralized API URL: Uses live Render backend in production (Netlify) and localhost during local development
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Header({ isAdmin, setIsAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true'); // Save login state
        setShowModal(false);
        setPasswordInput('');
        navigate('/admin');
      } else {
        alert(data.message || 'Incorrect password!');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Failed to connect to the server for authentication.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin'); // Clear login state
    navigate('/');
  };

  return (
    <>
      <nav className="bg-purple-100 border-b-4 border-[oklch(0.68_0.2_308.74)] px-4 sm:px-8 py-4 flex flex-col min-[767px]:flex-row justify-between items-center gap-3 sticky top-0 z-50 shadow-md">

        {/* Brand Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-black text-white-950 flex items-center gap-2 drop-shadow-[1px_1px_0px_#fff]">
          <span className="bg-white p-2 rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] text-white-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </span>
          <span className="tracking-wider flex items-center gap-1">
            STORYTOON <Sparkles className="w-4 h-4 text-white-500 stroke-[2.5] inline" />
          </span>
        </Link>

        {/* Nav Actions */}
        <div className="flex gap-2.5 items-center flex-wrap justify-center">

          <Link
            to="/"
            className={`font-extrabold px-3.5 sm:px-4 py-2 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] hover:translate-y-[-2px] active:translate-y-[0px] transition flex items-center gap-1.5 text-xs sm:text-sm ${location.pathname === '/' ? 'bg-purple-300 text-white' : 'bg-white text-white-950'
              }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> Library
          </Link>

          <Link
            to="/favorites"
            className={`font-extrabold px-3.5 sm:px-4 py-2 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] hover:translate-y-[-2px] active:translate-y-[0px] transition flex items-center gap-1.5 text-xs sm:text-sm ${location.pathname === '/favorites' ? 'bg-purple-300 text-white fill-black' : 'bg-white text-white-950'
              }`}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 fill-white stroke-[2.5]" /> Favorites
          </Link>

          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 font-extrabold px-3.5 sm:px-4 py-2 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] hover:translate-y-[-2px] active:translate-y-[0px] transition text-xs sm:text-sm ${location.pathname === '/admin' ? 'bg-purple-300 text-white' : 'bg-white text-white-950'
                  }`}
              >
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> Admin Studio
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-white text-red-500 font-extrabold px-3 py-2 rounded-full border-2 border-red-700 shadow-[2px_2px_0px_#fca5a5] hover:translate-y-[-2px] transition text-xs sm:text-sm cursor-pointer"
                title="Logout Admin"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-white text-white-950 font-extrabold px-3.5 sm:px-4 py-2 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] hover:translate-y-[-2px] active:translate-y-[0px] transition text-xs sm:text-sm cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> Admin Login
            </button>
          )}
        </div>
      </nav>

      {/* Custom Admin Login Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-purple-50 border-4 border-[oklch(0.68_0.2_308.74)] p-6 rounded-3xl shadow-[6px_6px_0px_#c5acd9] w-full max-w-md relative animate-in fade-in zoom-in duration-200">

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-white p-1.5 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] hover:bg-purple-200 transition cursor-pointer"
            >
              <X className="w-4 h-4 text-white-950" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-purple-600 text-white p-2 rounded-xl border-2 border-[oklch(0.68_0.2_308.74)]">
                <Shield className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-black text-white-950">Admin Restricted Area</h2>
            </div>

            <p className="text-xs sm:text-sm text-white-900 mb-4 font-medium">
              Please enter the admin password to manage and add story books to the library.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 bg-white border-2 border-purple-700 rounded-xl font-bold text-white-950 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-[2px_2px_0px_#c5acd9]"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-extrabold rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] hover:bg-gray-300 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-300 text-white font-extrabold rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] hover:bg-purple-400 transition text-sm cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}