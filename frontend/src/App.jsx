import { useState, useEffect } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'
import Home from './pages/Home'
import Predict from './pages/Predict'
import HealthTips from './pages/HealthTips'

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Deteksi scroll untuk efek bayangan pada navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Reset halaman ke atas & tutup menu saat navigasi berpindah
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [currentPage]);

  // 3. Kunci scroll body agar tidak berantakan saat menu mobile terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinkClass = (page) => `
    transition-all duration-300 font-bold uppercase tracking-[0.2em]
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center relative">

          {/* LOGO - z-[130] agar selalu di atas overlay putih */}
          <div
            className="text-xl md:text-2xl font-black text-blue-600 cursor-pointer tracking-tighter z-[130]"
            onClick={() => setCurrentPage('home')}
          >
            HYPERTENSIFY<span className="text-slate-400 text-[10px] md:text-xs ml-1 font-medium tracking-normal"></span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-10 text-[11px]">
            <button onClick={() => setCurrentPage('home')} className={navLinkClass('home')}>Home</button>
            <button onClick={() => setCurrentPage('predict')} className={navLinkClass('predict')}>Screening Tool</button>
            <button onClick={() => setCurrentPage('tips')} className={navLinkClass('tips')}>Health Tips</button>
          </div>

          {/* DESKTOP ACTION */}
          <div className="hidden md:block">
            <button
              onClick={() => setCurrentPage('predict')}
              className="bg-blue-600 text-white px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95 shadow-blue-100"
            >
              Predict Now
            </button>
          </div>

          {/* MOBILE HAMBURGER BUTTON - z-[130] */}
          <button
            className="md:hidden p-2 z-[130] text-slate-600 transition-transform active:scale-90 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} className="text-slate-900" /> : <Menu size={28} />}
          </button>
        </div>

        {/* --- MOBILE OVERLAY MENU (SUPER SOLID WHITE) --- */}
        <div className={`
          fixed inset-0 !bg-white z-[120] flex flex-col transition-all duration-500 ease-in-out md:hidden
          ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
        `}>
          {/* Spacer putih agar tidak transparan di area logo */}
          <div className="h-20 !bg-white w-full shrink-0"></div>

          <div className="flex flex-col items-center justify-center flex-grow space-y-12 px-8 pb-32 !bg-white">
            <div className="flex flex-col items-center space-y-10">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-4xl font-black tracking-tighter transition-all ${currentPage === 'home' ? 'text-blue-600' : 'text-slate-200 hover:text-slate-400'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('predict')}
                className={`text-4xl font-black tracking-tighter transition-all ${currentPage === 'predict' ? 'text-blue-600' : 'text-slate-200 hover:text-slate-400'}`}
              >
                Screening
              </button>
              <button
                onClick={() => setCurrentPage('tips')}
                className={`text-4xl font-black tracking-tighter transition-all ${currentPage === 'tips' ? 'text-blue-600' : 'text-slate-200'}`}
              >
                Health Tips
              </button>
            </div>

            <button
              onClick={() => setCurrentPage('predict')}
              className="w-full max-w-xs bg-blue-600 text-white py-5 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              PREDICT NOW <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- DYNAMIC CONTENT --- */}
      <main className="min-h-[70vh] animate-in fade-in duration-700">
        {currentPage === 'home' && (
          <Home onStart={() => setCurrentPage('predict')} />
        )}

        {currentPage === 'predict' && (
          <Predict />
        )}

        {currentPage === 'tips' && (
          <HealthTips />
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 py-16 md:py-24 px-6 text-white mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 border-b border-slate-800 pb-12 md:pb-20 mb-12">

          <div className="md:col-span-2 text-center md:text-left">
            <h3 className="text-2xl font-black mb-6 text-blue-500 tracking-tighter uppercase">HYPERTENSIFY</h3>
            <p className="text-slate-400 max-w-sm mx-auto md:mx-0 leading-relaxed text-base md:text-lg font-light">
              Empowering individuals with AI-driven early detection tools for hypertension.
              Designed for privacy, speed, and accuracy.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-slate-600">Explore</h4>
            <ul className="text-slate-400 space-y-4 font-medium">
              <li className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setCurrentPage('home')}>Home</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setCurrentPage('predict')}>Start Screening</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setCurrentPage('tips')}>Health Advice</li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-slate-600">Project Detail</h4>
            <p className="text-slate-500 text-sm leading-relaxed italic">
              A Computer Science final thesis project focused on Machine Learning implementation for preventive healthcare.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-600 text-[9px] md:text-[10px] tracking-[0.3em] font-black space-y-6 md:space-y-0 text-center">
          <p uppercase>© 2026 HYPERTENSIFY • OPEN SOURCE INITIATIVE</p>
          <div className="flex gap-6 italic text-slate-400 opacity-60 uppercase font-bold">
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