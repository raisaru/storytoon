import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Edit3, BookOpen, Sparkles, X, Upload, Link as LinkIcon, CheckCircle2, Tag, Image as ImageIcon, Eye } from 'lucide-react';
import bgImg from '../assets/img/6.jpg';

// Centralized API URL: Uses live Render backend in production (Netlify) and localhost during local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('For Kids');
  const [coverImage, setCoverImage] = useState('');

  // Pages state: array of objects { text: '', image: '' }
  const [pages, setPages] = useState([{ text: '', image: '' }]);

  const [imageInputType, setImageInputType] = useState('url');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const categoryOptions = [
    'For Kids', 'Middle Grade', 'Fairy Tales', 'Adventure',
    'Fantasy', 'Science Fiction', 'Mystery', 'Educational',
    'Animal Stories', 'Historical Fiction'
  ];

  // 1. Fetch books on component mount
  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        }
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePageImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...pages];
        updated[index].image = reader.result;
        setPages(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPage = () => {
    setPages([...pages, { text: '', image: '' }]);
  };

  const handleRemovePage = (index) => {
    if (pages.length === 1) return;
    setPages(pages.filter((_, i) => i !== index));
  };

  const handlePageTextChange = (index, value) => {
    const updated = [...pages];
    updated[index].text = value;
    setPages(updated);
  };

  const handlePageImageChange = (index, value) => {
    const updated = [...pages];
    updated[index].image = value;
    setPages(updated);
  };

  // 2. Update handleSaveBook to send POST / PUT requests
  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!title || !author) return;

    const finalCover = coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
    const finalCategory = category || 'For Kids';
    const validPages = pages.filter((p) => p.text.trim() !== '' || p.image.trim() !== '');
    const finalPages = validPages.length > 0 ? validPages : [{ text: 'Once upon a time...', image: '' }];

    const bookData = {
      title,
      author,
      category: finalCategory,
      coverImage: finalCover,
      pages: finalPages
    };

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/books/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData)
        });
        const updated = await response.json();
        setBooks(books.map((book) => ((book._id || book.id) === editingId ? updated : book)));
        setSuccessMessage('✏ Story updated successfully in the database!');
        setEditingId(null);
      } else {
        const response = await fetch(`${API_URL}/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData)
        });
        const savedBook = await response.json();
        setBooks([savedBook, ...books]);
        setSuccessMessage('🎉 Cartoon story published successfully to the database!');
      }

      // Reset Form
      setTitle('');
      setAuthor('');
      setCategory('For Kids');
      setCoverImage('');
      setPages([{ text: '', image: '' }]);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  const handleEditClick = (book) => {
    const id = book._id || book.id;
    setEditingId(id);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category || 'For Kids');
    setCoverImage(book.coverImage);

    const loadedPages = (book.pages || []).map((p) =>
      typeof p === 'string' ? { text: p, image: '' } : { text: p.text || '', image: p.image || '' }
    );
    setPages(loadedPages.length > 0 ? loadedPages : [{ text: '', image: '' }]);
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewClick = (book) => {
    const bookId = book._id || book.id;
    navigate(`/read/${bookId}`);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setCategory('For Kids');
    setCoverImage('');
    setPages([{ text: '', image: '' }]);
    setSuccessMessage('');
  };

  const handleDeleteBook = async (id) => {
    try {
      await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });
      setBooks(books.filter((book) => book._id !== id && book.id !== id));
      if (editingId === id) handleCancelEdit();
      setSuccessMessage('🗑 Story deleted successfully from the database!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-4xl mx-auto min-h-screen">

      {/* Cartoon Banner */}
      <div
        className="border-4 border-[oklch(0.68_0.2_308.74)] shadow-[4px_4px_0px_#c5acd9] sm:shadow-[6px_6px_0px_#c5acd9] p-5 sm:p-8 rounded-3xl text-white-950 mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div>
          <span className="bg-purple-100 border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] text-white-950 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" /> Creator Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide uppercase">Admin Story Studio</h1>
          <p className="text-white-950 font-bold text-xs sm:text-sm mt-1">Publish, edit, or manage cartoon stories in your public catalog.</p>
        </div>
        <div className="bg-white border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-center w-full sm:w-auto">
          <span className="block text-2xl sm:text-3xl font-black">{books.length}</span>
          <span className="text-[10px] sm:text-xs font-black text-white-900 uppercase">Stories</span>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-purple-300 border-4 border-[oklch(0.68_0.2_308.74)] p-3.5 sm:p-4 rounded-3xl shadow-[3px_3px_0px_#c5acd9] sm:shadow-[4px_4px_0px_#c5acd9] flex items-center gap-3 text-white-950 font-black text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-white-900 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSaveBook} className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl border-4 border-[oklch(0.68_0.2_308.74)] shadow-[6px_6px_0px_#78350f] sm:shadow-[8px_8px_0px_#c5acd9] mb-10 sm:mb-12 space-y-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-white-950">
            {editingId ? <Edit3 className="text-white-600 w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" /> : <PlusCircle className="text-white-600 w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />}
            {editingId ? 'Edit Story & Pages' : 'Add New Story with Pages'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-200 hover:bg-gray-300 text-slate-800 font-bold px-2.5 py-1.5 rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] text-xs flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-black text-white-900 uppercase mb-1">Story Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-[oklch(0.68_0.2_308.74)] p-2.5 sm:p-3 rounded-xl font-bold shadow-[2px_2px_0px_#c5acd9] focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] sm:text-xs font-black text-white-900 uppercase mb-1">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border-2 border-[oklch(0.68_0.2_308.74)] p-2.5 sm:p-3 rounded-xl font-bold shadow-[2px_2px_0px_#c5acd9] focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-black text-white-900 uppercase mb-1">Select Category</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-white-800 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 sm:py-3 border-2 border-[oklch(0.68_0.2_308.74)] rounded-xl font-bold shadow-[2px_2px_0px_#c5acd9] focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-white cursor-pointer"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] sm:text-xs font-black text-white-900 uppercase">Book Cover Image</label>
              <div className="flex gap-1 text-[10px] font-black">
                <button type="button" onClick={() => setImageInputType('url')} className={`px-2 py-0.5 rounded border border-[oklch(0.68_0.2_308.74)] transition ${imageInputType === 'url' ? 'bg-purple-300 text-white-950' : 'bg-white text-slate-600'}`}>Link</button>
                <button type="button" onClick={() => setImageInputType('upload')} className={`px-2 py-0.5 rounded border border-[oklch(0.68_0.2_308.74)] transition ${imageInputType === 'upload' ? 'bg-purple-300 text-white-950' : 'bg-white text-slate-600'}`}>Upload</button>
              </div>
            </div>

            {imageInputType === 'url' ? (
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-white-800" />
                <input
                  type="text"
                  placeholder="https://..."
                  value={coverImage.startsWith('data:') ? '' : coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-[oklch(0.68_0.2_308.74)] rounded-xl font-bold shadow-[2px_2px_0px_#c5acd9] focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-white-950 font-bold px-4 py-2.5 rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] cursor-pointer transition text-xs">
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                  <span>Choose Cover File</span>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
              </div>
            )}
            {coverImage && <p className="text-[10px] text-white-900 font-bold mt-1">✓ Cover ready!</p>}
          </div>
        </div>

        {/* Page-by-Page Builder */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black text-white-900 uppercase">Story Pages & Illustrations</label>
            <button
              type="button"
              onClick={handleAddPage}
              className="bg-purple-300 hover:bg-purple-400 text-white-950 font-black text-xs px-3 py-1.5 rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] transition"
            >
              + Add Page
            </button>
          </div>

          {pages.map((page, index) => (
            <div key={index} className="bg-purple-50/70 border-2 border-[oklch(0.68_0.2_308.74)] p-4 rounded-xl shadow-[3px_3px_0px_#c5acd9] space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="bg-purple-200 border border-[oklch(0.68_0.2_308.74)] px-2.5 py-0.5 rounded-full text-[11px] font-black text-white-950">
                  Page {index + 1}
                </span>
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePage(index)}
                    className="text-rose-600 hover:text-rose-800 text-xs font-black bg-white px-2 py-0.5 rounded border border-rose-300"
                  >
                    Remove Page
                  </button>
                )}
              </div>

              <textarea
                placeholder={`Write text for page ${index + 1}...`}
                value={page.text}
                onChange={(e) => handlePageTextChange(index, e.target.value)}
                rows="3"
                className="w-full border-2 border-[oklch(0.68_0.2_308.74)] p-3 rounded-xl font-bold bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm shadow-inner"
              ></textarea>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-white-800" />
                  <input
                    type="text"
                    placeholder="https://..."
                    value={page.image.startsWith('data:') ? '[Uploaded Image]' : page.image}
                    onChange={(e) => handlePageImageChange(index, e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border-2 border-[oklch(0.68_0.2_308.74)] rounded-xl font-bold bg-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center justify-center gap-1.5 bg-white hover:bg-purple-100 text-white-950 font-bold px-3 py-2 rounded-xl border border-[oklch(0.68_0.2_308.74)] text-xs cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Upload Page Image</span>
                    <input type="file" accept="image/*" onChange={(e) => handlePageImageUpload(index, e)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className={`w-full font-black py-3.5 sm:py-4 rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[3px_3px_0px_#c5acd9] sm:shadow-[4px_4px_0px_#c5acd9] transition transform hover:translate-y-[-2px] active:translate-y-[0px] text-sm sm:text-base ${editingId ? 'bg-purple-300 hover:bg-purple-400 text-white-950' : 'bg-purple-100 hover:bg-purple-200 text-white-950'}`}>
          {editingId ? 'Save Changes' : 'Publish Story Now!'}
        </button>
      </form>

      {/* Inventory List */}
      <h2 className="text-lg sm:text-xl font-black mb-4 text-white-950 flex items-center gap-2">
        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" /> Manage Stories ({books.length})
      </h2>

      <div className="bg-white rounded-3xl border-4 border-[oklch(0.68_0.2_308.74)] shadow-[6px_6px_0px_#c5acd9] sm:shadow-[8px_8px_0px_#c5acd9] divide-y-2 divide-[oklch(0.68_0.2_308.74)] overflow-hidden">
        {books.map((book) => {
          const bookId = book._id || book.id;
          return (
            <div key={bookId} className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:bg-purple-100 transition">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <img src={book.coverImage} alt="" className="w-12 h-16 sm:w-14 sm:h-20 object-cover rounded-xl border-2 border-[oklch(0.68_0.2_308.74)] shadow-[2px_2px_0px_#c5acd9] flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-black text-white-950 text-sm sm:text-base truncate">{book.title}</h3>
                  <p className="text-[11px] sm:text-xs text-white-800 font-bold mt-0.5 truncate">By {book.author} <span className="bg-purple-100 border border-[oklch(0.68_0.2_308.74)] px-2 py-0.5 rounded text-white-950">{book.category}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[oklch(0.68_0.2_308.74)]">
                <button
                  onClick={() => handleViewClick(book)}
                  className="bg-[#88d398] border-2 border-white shadow-[2px_2px_0px_#c5acd9] text-white-950 hover:bg-[#56af68] p-2.5 sm:p-3 rounded-xl transition"
                  title="Read Story"
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                </button>
                <button onClick={() => handleEditClick(book)} className="bg-[#239bf5] border-2 border-white shadow-[2px_2px_0px_#c5acd9] text-white-950 hover:bg-[#238fdf] p-2.5 sm:p-3 rounded-xl transition" title="Edit Story">
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                </button>
                <button onClick={() => handleDeleteBook(bookId)} className="bg-[#fb2c36] border-2 border-white shadow-[2px_2px_0px_#c5acd9] text-white-950 hover:bg-[#d12e36] p-2.5 sm:p-3 rounded-xl transition" title="Delete Story">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}