import { Link } from 'react-router-dom';
import { BookOpen, Heart, Shield, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-purple-100 border-t-4 border-purple-900 text-white-950 pt-12 pb-8 px-4 sm:px-8 shadow-[inset_0px_4px_0px_#c6b3d3]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-10 border-b-2 border-purple-900/30">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-3">
          <Link to="/" className="text-xl font-black flex items-center gap-2">
            <span className="bg-white p-2 rounded-2xl border-2 border-purple-900 shadow-[2px_2px_0px_#c5acd9] text-white-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="tracking-wider">STORYTOON</span>
          </Link>
          <p className="text-xs font-bold text-white-900 leading-relaxed max-w-sm">
            An immersive e-library where children explore vibrant illustrated stories and ignite their imagination.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3 md:text-right">
          <h4 className="text-xs font-black uppercase tracking-wider text-white-900 bg-purple-200/80 px-3 py-1 rounded-lg border border-purple-900 w-max md:ml-auto">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs font-bold flex flex-col md:items-end">
            <li>
              <Link to="/" className="hover:text-purple-600 transition flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 stroke-[2.5]" /> Explore Catalog
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-purple-600 transition flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 stroke-[2.5]" /> Admin Studio
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright & Bottom Bar */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
        <p className="text-xs font-black flex items-center justify-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500 inline" /> for young minds & storytellers.
        </p>
        <p className="text-[11px] font-bold text-white-900">
          © {new Date().getFullYear()} StoryToon E-Library. All rights reserved.
        </p>
      </div>
    </footer>
  );
}