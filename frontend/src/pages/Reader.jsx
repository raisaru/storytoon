import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Sparkles, Volume2, Star, Smile } from 'lucide-react';
import API_URL from '../api';

export default function Reader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch book from backend by ID
  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(b => (b.id === id || b._id === id));
          setBook(found || null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching book for reading:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-amber-50 font-black text-amber-900">📖 Loading story...</div>;
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-4 text-center sm:px-6">
        <div className="bg-white border-4 border-[oklch(0.68_0.2_308.74)] shadow-[8px_8px_0px_#c5acd9] p-8 rounded-3xl max-w-md w-full">
          <BookOpen className="text-2xl font-black text-white-950 mb-3">Chapter Closed!</BookOpen>
          <p className="text-sm font-bold text-white-800 mb-6">This story seems to have flown away from the backend database!</p>
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-green-300 hover:bg-purple-400 border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] text-amber-950 px-6 py-3 rounded-full font-black text-sm transition">
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Return to Library
          </Link>
        </div>
      </div>
    );
  }

  const rawPages = book.pages || [{ text: book.content || "No content found.", image: '' }];
  const pagesList = rawPages.map(p => typeof p === 'string' ? { text: p, image: '' } : p);
  const activePage = pagesList[currentPage] || { text: '', image: '' };
  const progressPercent = Math.round(((currentPage + 1) / pagesList.length) * 100);

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activePage.text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 flex flex-col justify-between py-6 px-4 sm:px-6">

      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center gap-3">
        <Link to="/" className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] text-amber-950 font-black hover:translate-y-[-2px] transition text-xs sm:text-sm">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> Library Catalog
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReadAloud}
            className="bg-[#08ff08] hover:bg-sky-400 text-white-950 px-4 py-2.5 rounded-2xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] font-black text-xs flex items-center gap-1.5 transition active:translate-y-[1px]"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" /> Read Aloud
          </button>
          <span className="bg-[#0ff] border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] text-white-950 font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 stroke-[2.5]" /> Page {currentPage + 1} / {pagesList.length}
          </span>
        </div>
      </div>

      {/* Comic Book Panel Stage */}
      <div className="max-w-5xl mx-auto w-full my-6 bg-white p-4 sm:p-10 md:p-12 rounded-[2rem] border-4 border-[oklch(0.68_0.2_308.74)] shadow-[6px_6px_0px_#c5acd9] sm:shadow-[10px_10px_0px_#c5acd9] sm:rounded-[2.5rem] relative flex flex-col justify-between">

        {/* Floating Badges */}
        <div className="absolute -top-4 -left-4 bg-purple-300 border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] text-amber-950 font-black text-xs px-4 py-1.5 rounded-full rotate-[-4deg] flex items-center gap-1 z-10">
          <Star className="w-3.5 h-3.5 fill-white-200 stroke-[2.5]" /> Page {currentPage + 1}
        </div>

        <div className="absolute -top-4 -right-4 bg-purple-300 border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] text-white-950 font-black text-xs px-4 py-1.5 rounded-full rotate-[4deg] flex items-center gap-1 z-10">
          <Smile className="w-3.5 h-3.5 stroke-[2.5]" /> {book.category || 'Story'}
        </div>

        <div>
          <div className="text-center mb-6 pt-2">
            <h2 className="text-xl sm:text-2xl font-black text-white-950 uppercase tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-white-500 fill-white-400 stroke-[2.5]" />
              {book.title}
            </h2>
            <p className="text-xs text-white-800 font-bold mt-1">By {book.author}</p>
            <hr className="mt-4 border-2 border-[oklch(0.68_0.2_308.74)]" />
          </div>

          {/* Illustration / Graphic Panel */}
          <div className="w-full max-w-md mx-auto h-56 sm:h-80 rounded-2xl border-3 border-[oklch(0.68_0.2_308.74)] overflow-hidden shadow-[5px_5px_0px_#c5acd9] bg-purple-100 mb-6 relative flex items-center justify-center">
            <img
              src={activePage.image || book.coverImage}
              alt={`Illustration for page ${currentPage + 1}`}
              className="w-full object-cover"
            />
          </div>

          {/* Text Box */}
          <div className="bg-purple-50 border-3 border-[oklch(0.68_0.2_308.74)] p-6 sm:p-8 rounded-3xl shadow-[4px_4px_0px_#c5acd9] relative">
            <p className="text-lg sm:text-xl md:text-2xl font-black text-white-950 leading-relaxed text-center sm:text-left">
              "{activePage.text}"
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-8 mt-8 border-t-2 border-[oklch(0.68_0.2_308.74)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] transition text-sm ${currentPage === 0 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 shadow-none' : 'bg-purple-200 text-white-950 hover:bg-purple-300'
              }`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" /> Prev Page
          </button>

          <div className="flex items-center gap-3 bg-purple-100 border-2 border-[oklch(0.68_0.2_308.74)] px-4 py-2 rounded-2xl shadow-[2px_2px_0px_#c5acd9] w-full sm:w-auto justify-center">
            <div className="w-28 sm:w-36 bg-white h-3 rounded-full border-2 border-[oklch(0.68_0.2_308.74)] overflow-hidden p-0.5">
              <div className="bg-purple-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="text-xs font-black text-white-950">{progressPercent}%</span>
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(pagesList.length - 1, p + 1))}
            disabled={currentPage === pagesList.length - 1}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] transition text-sm ${currentPage === pagesList.length - 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 shadow-none' : 'bg-purple-200 text-white-950 hover:bg-purple-300'
              }`}
          >
            Next Page <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-white-900 font-bold">
        StoryToon Comic Library • Adventure Awaits!
      </div>
    </div>
  );
}