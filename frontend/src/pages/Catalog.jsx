import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, BookOpen, Heart } from 'lucide-react';
import API_URL from '../api';

// Centralized API URL: Uses live Render backend in production (Netlify) and localhost during local development
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // State for favorites (stored as an array of book IDs in localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('storytoon_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('storytoon_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite status for a book
  const toggleFavorite = (e, bookId) => {
    e.preventDefault(); // Prevent opening the book link when clicking the heart
    setFavorites(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  // Fetch books from backend server on load
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

  const categories = ['All', ...new Set(books.map(b => b.category).filter(Boolean))];

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = (book.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (book.author || '').toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories present in the filtered view
  const activeCategories = [...new Set(filteredBooks.map(b => b.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-purple-50 text-white-950 pb-20">

      {/* Cartoon Storybook Forest Hero Banner */}
      <div className="relative w-full h-[460px] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b-4 border-[oklch(0.68_0.2_308.74)] shadow-md bg-purple-700">

        {/* Cartoon Illustration Background Image with Soft Contrast Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-emerald-950/30 to-amber-950/60"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto mb-6 px-4">
          <span className="bg-purple-200 border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] text-white-950 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" /> Fun & Free Kids Stories!
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-wide text-white drop-shadow-[4px_4px_0px_#c5acd9] uppercase">
            Pick a Magical Story!
          </h1>
          <p className="text-white-950 font-bold bg-purple-100/95 border-2 border-[oklch(0.68_0.2_308.74)] px-4 py-1.5 rounded-2xl max-w-md mx-auto mt-3 shadow-[2px_2px_0px_#c5acd9] text-sm">
            Click a category button below to filter stories!
          </p>
        </div>

        {/* Chunky Cartoon Pill Buttons */}
        <div className="relative z-10 max-w-4xl w-full flex flex-wrap justify-center items-center gap-3 px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-black text-sm md:text-base border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] transition-all transform hover:translate-y-[-3px] active:translate-y-[0px] ${selectedCategory === cat
                  ? 'bg-purple-300 text-white-950 ring-2 ring-white'
                  : 'bg-white text-white-950 hover:bg-purple-100'
                }`}
            >
              {cat === 'All' ? 'ALL STORIES' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar & Counter */}
      <div className="max-w-6xl mx-auto px-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-3.5 text-white-900 w-5 h-5 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-[oklch(0.68_0.2_308.74)] rounded-2xl bg-white text-white-950 font-bold shadow-[3px_3px_0px_#c5acd9] focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="text-sm font-black text-white-950 bg-purple-200 px-5 py-2.5 rounded-2xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] flex items-center gap-2">
          <BookOpen className="w-4 h-4 stroke-[2.5]" /> Stories Found: {filteredBooks.length}
        </div>
      </div>

      {/* Categorized Books Sections */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {loading ? (
          <div className="text-center py-20 font-black text-white-900 text-lg">📚 Loading magical stories from backend...</div>
        ) : (
          activeCategories.map((category) => {
            const categoryBooks = filteredBooks.filter(book => book.category === category);

            return (
              <div key={category} className="space-y-4">

                {/* Category Header Bar */}
                <div className="flex items-center gap-3 bg-purple-200/70 border-2 border-[oklch(0.68_0.2_308.74)] px-5 py-3 rounded-2xl shadow-[3px_3px_0px_#c5acd9]">
                  <h2 className="text-lg md:text-xl font-black text-white-950 uppercase tracking-wide">
                    📖 {category}
                  </h2>
                  <span className="ml-auto bg-white border border-[oklch(0.68_0.2_308.74)] px-3 py-0.5 rounded-full text-xs font-black">
                    {categoryBooks.length} {categoryBooks.length === 1 ? 'Story' : 'Stories'}
                  </span>
                </div>

                {/* Books Grid for this Category */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {categoryBooks.map((book) => {
                    const bookId = book.id || book._id;
                    const isFav = favorites.includes(bookId);

                    return (
                      <Link
                        key={bookId}
                        to={`/read/${bookId}`}
                        className="group bg-white p-3.5 rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[4px_4px_0px_#c5acd9] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#c5acd9] transition-all flex flex-col relative"
                      >
                        {/* Favorite Heart Button Overlay */}
                        <button
                          onClick={(e) => toggleFavorite(e, bookId)}
                          className={`absolute top-5 right-5 z-20 p-2 rounded-full border-1 shadow-[2px_2px_0px_#c5acd9] transition transform hover:scale-110 cursor-pointer ${
                            isFav ? 'bg-purple-500 text-white' : 'bg-white text-gray-400 hover:text-purple-500'
                          }`}
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart className={`w-4 h-4 stroke-[2.5] ${isFav ? 'fill-white text-white' : ''}`} />
                        </button>

                        <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] bg-purple-100 mb-3 relative">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <span className="text-[10px] font-black text-white-950 bg-purple-200 px-2.5 py-1 rounded-full w-max mb-1.5 border border-[oklch(0.68_0.2_308.74)]">
                          {book.category}
                        </span>
                        <h3 className="font-black text-white-950 text-sm line-click-1 group-hover:text-white-600 transition">
                          {book.title}
                        </h3>
                        <p className="text-xs text-white-800 font-bold mt-0.5">{book.author}</p>
                      </Link>
                    );
                  })}
                </div>

              </div>
            );
          })
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-20 bg-white border-4 border-amber-900 rounded-3xl shadow-[6px_6px_0px_#c5acd9]">
            <p className="text-xl font-black text-white-950">No stories found matching your search!</p>
          </div>
        )}
      </div>

    </div>
  );
}