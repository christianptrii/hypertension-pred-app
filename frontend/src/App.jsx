import { useState } from 'react'
import Home from './pages/Home'
// import Predict from './pages/Predict'
import HealthTips from './pages/HealthTips'

function App() {
  // State untuk mengatur halaman mana yang sedang aktif
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-600">

      {/* --- NAVBAR --- */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div
            className="text-2xl font-black text-blue-600 cursor-pointer tracking-tighter"
            onClick={() => setCurrentPage('home')}
          >
            HYPERTENSIFY<span className="text-slate-400 text-xs ml-1 font-medium tracking-normal">v1.0</span>
          </div>

          {/* MAIN MENU */}
          <div className="hidden md:flex space-x-10 font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400">
            <button
              onClick={() => setCurrentPage('home')}
              className={`${currentPage === 'home' ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors underline-offset-8 decoration-2 ${currentPage === 'home' ? 'underline' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('predict')}
              className={`${currentPage === 'predict' ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors underline-offset-8 decoration-2 ${currentPage === 'predict' ? 'underline' : ''}`}
            >
              Screening Tool
            </button>
            <button
              onClick={() => setCurrentPage('tips')}
              className={`${currentPage === 'tips' ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors underline-offset-8 decoration-2 ${currentPage === 'tips' ? 'underline' : ''}`}
            >
              Health Tips
            </button>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={() => setCurrentPage('predict')}
            className="bg-blue-600 text-white px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center gap-2"
          >
            Predict Now
          </button>
        </div>
      </nav>

      {/* --- DYNAMIC CONTENT --- */}
      <main className="min-h-[70vh]">
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
      <footer className="bg-slate-950 py-24 px-6 text-white mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 border-b border-slate-800 pb-20 mb-12 text-left">

          {/* Brand Info */}
          <div className="col-span-2">
            <h3 className="text-2xl font-black mb-8 text-blue-500 tracking-tighter uppercase">HYPERTENSIFY</h3>
            <p className="text-slate-400 max-w-sm leading-relaxed text-lg">
              Empowering individuals with AI-driven early detection tools for hypertension.
              Designed for privacy, speed, and accuracy.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-8 text-xs uppercase tracking-[0.2em] text-slate-600">Explore</h4>
            <ul className="text-slate-400 space-y-5 font-medium">
              <li
                className="hover:text-blue-400 cursor-pointer transition-colors"
                onClick={() => setCurrentPage('home')}
              >
                Home
              </li>
              <li
                className="hover:text-blue-400 cursor-pointer transition-colors"
                onClick={() => setCurrentPage('predict')}
              >
                Start Screening
              </li>
              <li
                className="hover:text-blue-400 cursor-pointer transition-colors"
                onClick={() => setCurrentPage('tips')}
              >
                Health Advice
              </li>
            </ul>
          </div>

          {/* Academic Info */}
          <div>
            <h4 className="font-bold mb-8 text-xs uppercase tracking-[0.2em] text-slate-600">Project Detail</h4>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              A Computer Science final thesis project focused on Machine Learning implementation for preventive healthcare.
            </p>
            <div className="inline-flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest cursor-pointer hover:underline">
              View Repository →
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-600 text-[10px] tracking-[0.3em] font-black">
          <p uppercase>© 2026 HYPERTENSIFY • OPEN SOURCE INITIATIVE</p>
          <div className="mt-6 md:mt-0 flex gap-6 italic text-slate-400">
            <span>REACT</span>
            <span>TAILWIND</span>
            <span>FLASK</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App