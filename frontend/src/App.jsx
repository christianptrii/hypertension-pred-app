import { useState, useEffect } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'
import Home from './pages/Home'
import About from './pages/About'
import Predict from './pages/Predict'
import HealthTips from './pages/HealthTips'

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
    const titles = {
      home: "Hypertensify | AI Health Companion",
      about: "About Science | Hypertensify",
      predict: "Screening Tool | Hypertensify",
      tips: "Health Tips | Hypertensify"
    };
    document.title = titles[currentPage] || "Hypertensify";
  }, [currentPage]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Font Nav diperbesar sedikit untuk keterbacaan (text-[13px])
  const navLinkClass = (page) => `
    transition-all duration-300 font-bold uppercase tracking-[0.2em] text-[13px]
    ${currentPage === page
      ? 'text-blue-600 md:underline underline-offset-8 decoration-2 opacity-100 scale-105'
      : 'text-slate-500 md:text-slate-400 hover:text-blue-600 opacity-80 hover:opacity-100'}
  `;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-600">

      {/* --- NAVBAR --- */}
      <nav className={`
        sticky top-0 w-full z-[100] transition-all duration-300
        ${isScrolled || isMenuOpen ? 'bg-white border-b border-slate-100 shadow-sm' : 'bg-white border-b border-transparent'}
      `}>
        {/* Padding ditingkatkan untuk kesan lebih luas */}
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative">

          {/* LOGO - Font Size Text-3xl */}
          <div
            className="text-2xl lg:text-3xl font-black text-blue-600 cursor-pointer tracking-tighter z-[130]"
            onClick={() => setCurrentPage('home')}
          >
            HYPERTENSIFY
          </div>

          {/* DESKTOP MENU - Perubahan dari md:flex ke lg:flex agar tablet menggunakan Mobile Menu */}
          <div className="hidden lg:flex space-x-10">
            <button onClick={() => setCurrentPage('home')} className={navLinkClass('home')}>Home</button>
            <button onClick={() => setCurrentPage('about')} className={navLinkClass('about')}>About</button>
            <button onClick={() => setCurrentPage('predict')} className={navLinkClass('predict')}>Screening Tool</button>
            <button onClick={() => setCurrentPage('tips')} className={navLinkClass('tips')}>Health Tips</button>
          </div>

          {/* DESKTOP ACTION - Muncul hanya di layar besar (Laptops/Desktop) */}
          <div className="hidden lg:block">
            <button
              onClick={() => setCurrentPage('predict')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg active:scale-95 shadow-blue-100"
            >
              Predict Now
            </button>
          </div>

          {/* HAMBURGER BUTTON - Sekarang muncul di Tablet (md) dan Mobile (sm) */}
          <button
            className="lg:hidden p-2 z-[130] text-slate-600 transition-transform active:scale-90 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={32} className="text-slate-900" /> : <Menu size={32} />}
          </button>
        </div>

        {/* --- MOBILE & TABLET OVERLAY MENU --- */}
        <div className={`
          fixed inset-0 !bg-white z-[120] flex flex-col transition-all duration-500 ease-in-out lg:hidden
          ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
        `}>
          <div className="h-24 !bg-white w-full shrink-0"></div>
          <div className="flex flex-col items-center justify-center flex-grow space-y-12 px-8 pb-32 !bg-white text-center">
            <div className="flex flex-col items-center space-y-8">
              <button onClick={() => setCurrentPage('home')} className={`text-4xl sm:text-5xl font-black tracking-tighter transition-all ${currentPage === 'home' ? 'text-blue-600' : 'text-slate-200'}`}>Home</button>
              <button onClick={() => setCurrentPage('about')} className={`text-4xl sm:text-5xl font-black tracking-tighter transition-all ${currentPage === 'about' ? 'text-blue-600' : 'text-slate-200'}`}>About</button>
              <button onClick={() => setCurrentPage('predict')} className={`text-4xl sm:text-5xl font-black tracking-tighter transition-all ${currentPage === 'predict' ? 'text-blue-600' : 'text-slate-200'}`}>Screening</button>
              <button onClick={() => setCurrentPage('tips')} className={`text-4xl sm:text-5xl font-black tracking-tighter transition-all ${currentPage === 'tips' ? 'text-blue-600' : 'text-slate-200'}`}>Health Tips</button>
            </div>
            <button onClick={() => setCurrentPage('predict')} className="w-full max-w-sm bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-3">
              PREDICT NOW <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- DYNAMIC CONTENT --- */}
      <main className="min-h-[70vh] animate-in fade-in duration-700">
        {currentPage === 'home' && <Home onStart={() => setCurrentPage('predict')} />}
        {currentPage === 'about' && <About onStart={() => setCurrentPage('predict')} />}
        {currentPage === 'predict' && <Predict />}
        {currentPage === 'tips' && <HealthTips />}
      </main>

      {/* --- FOOTER DIPERBESAR --- */}
      <footer className="bg-slate-950 py-20 lg:py-28 px-6 text-white mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16 mb-12">
          <div className="md:col-span-2 text-center md:text-left">
            <h3 className="text-3xl font-black mb-8 text-blue-500 tracking-tighter uppercase">HYPERTENSIFY</h3>
            <p className="text-slate-400 max-w-md mx-auto md:mx-0 leading-relaxed text-lg lg:text-xl font-light">
              Empowering individuals with AI-driven early detection tools for hypertension.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-8 text-sm uppercase tracking-[0.2em] text-slate-600">Explore</h4>
            <ul className="text-slate-400 space-y-5 text-base lg:text-lg font-medium">
              <li className="hover:text-blue-400 cursor-pointer" onClick={() => setCurrentPage('home')}>Home</li>
              <li className="hover:text-blue-400 cursor-pointer" onClick={() => setCurrentPage('about')}>About</li>
              <li className="hover:text-blue-400 cursor-pointer" onClick={() => setCurrentPage('predict')}>Start Screening</li>
              <li className="hover:text-blue-400 cursor-pointer" onClick={() => setCurrentPage('tips')}>Health Advice</li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-8 text-sm uppercase tracking-[0.2em] text-slate-600">Project Detail</h4>
            <p className="text-slate-500 text-base lg:text-lg italic">
              A Computer Science final thesis project focused on Machine Learning implementation for preventive healthcare, specifically hypertension.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-600 text-[11px] md:text-[13px] tracking-[0.3em] font-black space-y-6 md:space-y-0 text-center">
          <p className="uppercase">© 2026 HYPERTENSIFY</p>
          <div className="flex gap-8 italic text-slate-400 opacity-60 uppercase font-bold text-xs">
            <span>React</span>
            <span>Tailwind</span>
            <span>Flask</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App