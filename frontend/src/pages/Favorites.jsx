import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Favorites() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('storytoon_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch all books to match against saved favorite IDs
  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  // Remove or toggle favorite
  const toggleFavorite = (e, bookId) => {
    e.preventDefault();
    const updated = favorites.filter(id => id !== bookId);
    setFavorites(updated);
    localStorage.setItem('storytoon_favorites', JSON.stringify(updated));
  };

  const favoriteBooks = books.filter(book => favorites.includes(book.id || book._id));

  return (
    <div className="min-h-screen bg-purple-50 text-white-950 pb-20">
      
      {/* Cartoon Storybook Forest Hero Banner with Background Image */}
      <div className="relative w-full h-[340px] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b-4 border-[oklch(0.68_0.2_308.74)] shadow-md bg-purple-700">

        {/* Cartoon Illustration Background Image with Soft Contrast Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-emerald-950/30 to-amber-950/60"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 bg-white text-white-950 font-black px-4 py-2 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] mb-3 hover:bg-purple-100 transition text-sm">
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Back to Library
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black tracking-wide text-white drop-shadow-[4px_4px_0px_#c5acd9] uppercase flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-purple-500 fill-purple-500" /> My Favorite Stories
          </h1>
          <p className="text-white-950 font-bold bg-purple-100/95 border-2 border-[oklch(0.68_0.2_308.74)] px-4 py-1.5 rounded-2xl max-w-xs mx-auto mt-3 shadow-[2px_2px_0px_#c5acd9] text-xs sm:text-sm">
            All your bookmarked magical tales!
          </p>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20 font-black text-white-900 text-lg">📚 Loading your favorites...</div>
        ) : favoriteBooks.length === 0 ? (
          <div className="text-center py-20 bg-white border-4 border-[oklch(0.68_0.2_308.74)] rounded-3xl shadow-[6px_6px_0px_#c5acd9] max-w-lg mx-auto p-8">
            <Heart className="w-16 h-16 text-purple-400 fill-purple-400 mx-auto mb-4 animate-bounce" />
            <p className="text-xl font-black text-white-950 mb-2">No favorite stories added yet!</p>
            <p className="text-sm text-gray-600 font-medium mb-6">Click the heart icon on any story card in the library to save it here.</p>
            <Link to="/" className="inline-block bg-purple-600 text-white font-extrabold px-6 py-3 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] hover:bg-purple-500 transition">
              Explore Library 🌟
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {favoriteBooks.map((book) => {
              const bookId = book.id || book._id;
              return (
                <Link
                  key={bookId}
                  to={`/read/${bookId}`}
                  className="group bg-white p-3.5 rounded-xl border-2 border-purple-500 shadow-[4px_4px_0px_#c5acd9] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#c5acd9] transition-all flex flex-col relative"
                >
                  <button
                    onClick={(e) => toggleFavorite(e, bookId)}
                    className="absolute top-5 right-5 z-20 p-2 rounded-full border-1 shadow-[2px_2px_0px_#c5acd9] transition transform hover:scale-110 cursor-pointer bg-purple-500 text-white"
                    title="Remove from Favorites"
                  >
                    <Heart className="w-4 h-4 stroke-[2.5] fill-white text-white" />
                  </button>

                  <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-purple-500 bg-purple-100 mb-3 relative">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-black text-white-950 bg-purple-200 px-2.5 py-1 rounded-full w-max mb-1.5 border border-[oklch(0.68_0.2_308.74)]">
                    {book.category}
                  </span>
                  <h3 className="font-black text-gray-900 text-sm group-hover:text-white-700 transition">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-700 font-bold mt-0.5">{book.author}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}