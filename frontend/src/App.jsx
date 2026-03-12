import { useState } from 'react'
import Home from './pages/Home'
// import Predict from './pages/Predict'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-black text-blue-600 cursor-pointer tracking-tighter"
            onClick={() => setCurrentPage('home')}
          >
            HYPERTENSIFY<span className="text-slate-400 text-xs ml-1 font-medium tracking-normal">v1.0</span>
          </div>
          <div className="hidden md:flex space-x-10 font-bold text-sm uppercase tracking-widest text-slate-400">
            <button
              onClick={() => setCurrentPage('home')}
              className={currentPage === 'home' ? 'text-blue-600' : 'hover:text-blue-600'}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('predict')}
              className={currentPage === 'predict' ? 'text-blue-600' : 'hover:text-blue-600'}
            >
              Screening Tool
            </button>
          </div>
          <button
            onClick={() => setCurrentPage('predict')}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg"
          >
            Predict Now
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main>
        {currentPage === 'home' ? (
          <Home onStart={() => setCurrentPage('predict')} />
        ) : (
          <Predict />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-16 px-6 text-white mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 border-b border-slate-800 pb-12 mb-12">
          <div>
            <h3 className="text-xl font-black mb-4 text-blue-500">HYPERTENSIFY</h3>
            <p className="text-slate-400 leading-relaxed">
              An open-source ML research project dedicated to early cardiovascular risk detection.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-widest text-sm">Resources</h4>
            <ul className="text-slate-400 space-y-2">
              <li className="hover:text-blue-400 cursor-pointer">Machine Learning Model</li>
              <li className="hover:text-blue-400 cursor-pointer">Dataset Information</li>
              <li className="hover:text-blue-400 cursor-pointer">GitHub Repository</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-widest text-sm">Thesis Project</h4>
            <p className="text-slate-400 text-sm">
              Computer Science Department. Focus: Decision Support Systems & Machine Learning implementation.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-slate-500 text-xs tracking-widest">
          © 2026 HYPERTENSIFY PROJECT. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  )
}

export default App