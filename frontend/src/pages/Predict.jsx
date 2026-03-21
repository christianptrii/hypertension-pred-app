import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, HeartPulse, BrainCircuit, Loader2,
    AlertCircle, Info, FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Predict = () => {
    const reportRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [probability, setProbability] = useState(0);
    const [factors, setFactors] = useState([]);
    const [formData, setFormData] = useState({
        gender: '', age: '', smoking: '',
        height: '', weight: '', systole: '', diastole: ''
    });

    const [bmi, setBmi] = useState(0);

    // Auto BMI Calculation
    useEffect(() => {
        if (formData.height > 0 && formData.weight > 0) {
            const hMeter = formData.height / 100;
            const score = (formData.weight / (hMeter * hMeter)).toFixed(1);
            setBmi(score);
        }
    }, [formData.height, formData.weight]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- INTEGRASI REAL KE BACKEND FLASK ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            // Mengirim payload lengkap (formData + bmi) ke Flask
            const payload = { ...formData, bmi: bmi };
            const response = await fetch('https://hypertension-pred-app.vercel.app/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Server connection failed');

            const data = await response.json();
            if (data.status === 'success') {
                setResult(data.result);
                setProbability(data.probability);
                setFactors(data.factors);
                // Auto-scroll ke area hasil di Mobile
                if (window.innerWidth < 1024) {
                    setTimeout(() => {
                        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                }
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("Gagal terhubung ke AI Server. Pastikan Flask sudah dijalankan.");
        } finally {
            setLoading(false);
        }
    };

    // --- FUNGSI EXPORT PDF (FIX OKLCH ERROR DENGAN HEX) ---
    const downloadPDF = async () => {
        const element = reportRef.current;
        if (!element) return;

        setLoading(true);
        try {
            // Beri jeda 300ms agar UI stabil sempurna
            await new Promise(resolve => setTimeout(resolve, 300));

            const canvas = await html2canvas(element, {
                scale: 2, // Kualitas HD
                backgroundColor: '#0f172a', // Gunakan HEX manual
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Menambahkan margin atas 10mm
            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`Hypertensify_Report_${formData.age || 'Patient'}.pdf`);
        } catch (error) {
            console.error("Gagal export PDF:", error);
            alert("Terjadi kesalahan saat membuat PDF. Pastikan library terinstal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 md:py-16 px-4 md:px-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start">

                    {/* --- KIRI: FORM --- */}
                    <div className="w-full lg:flex-[1.5] bg-white p-6 md:p-10 rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden">
                        <div className="hidden lg:flex items-center gap-4 mb-10">
                            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Medical Data</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Enter parameters for Random Forest analysis</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                                    <select name="gender" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium appearance-none">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age (Years)</label>
                                    <input type="number" name="age" placeholder="Ex: 45" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Height (cm)</label>
                                    <input type="number" name="height" placeholder="170" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Weight (kg)</label>
                                    <input type="number" name="weight" placeholder="70" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                                </div>
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Result BMI</label>
                                    <div className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl font-black text-blue-600 flex items-center justify-center text-xl">
                                        {bmi > 0 ? bmi : '--'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Smoking</label>
                                    <select name="smoking" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none appearance-none cursor-pointer">
                                        <option value="">Status</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-2 text-red-600">
                                    <label className="text-xs font-bold uppercase tracking-wider ml-1">Systole</label>
                                    <input type="number" name="systole" placeholder="120" required onChange={handleInputChange} className="w-full p-4 bg-red-50/30 border border-red-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                                </div>
                                <div className="space-y-2 text-red-600">
                                    <label className="text-xs font-bold uppercase tracking-wider ml-1">Diastole</label>
                                    <input type="number" name="diastole" placeholder="80" required onChange={handleInputChange} className="w-full p-4 bg-red-50/30 border border-red-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg flex justify-center items-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-blue-200">
                                {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><BrainCircuit size={24} /> Get AI Prediction</>}
                            </button>
                        </form>
                    </div>

                    {/* --- KANAN: HASIL (FIXED FOR PDF ERROR) --- */}
                    <div className="w-full lg:flex-1 space-y-6">
                        {/* GUNAKAN INLINE STYLE BACKGROUND HEX UNTUK MENGHINDARI OKLCH ERROR */}
                        <div
                            id="result-card"
                            ref={reportRef}
                            style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                            className="p-8 rounded-[40px] shadow-2xl relative overflow-hidden min-h-[420px] flex flex-col"
                        >
                            <h3 style={{ color: '#60a5fa' }} className="text-lg font-bold mb-8 flex items-center gap-2 uppercase tracking-widest relative z-10">
                                <HeartPulse size={20} /> Analysis Result
                            </h3>

                            {!result ? (
                                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 opacity-50 relative z-10">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2 border border-white/10">
                                        <Info style={{ color: '#64748b' }} />
                                    </div>
                                    <p style={{ color: '#94a3b8' }} className="text-sm font-medium leading-relaxed max-w-[200px]">
                                        Please submit your data to see the AI analysis results.
                                    </p>
                                </div>
                            ) : (
                                <div className="animate-in zoom-in duration-500 relative z-10 flex-grow">
                                    {/* PROBABILITY GAUGE */}
                                    <div className="relative w-40 h-40 mb-10 mx-auto flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                                            <circle cx="80" cy="80" r="70"
                                                stroke={probability > 50 ? '#ef4444' : '#22c55e'} // HEX manual
                                                strokeWidth="12" fill="transparent"
                                                strokeDasharray={440}
                                                strokeDashoffset={440 - (440 * probability) / 100}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span style={{ color: '#ffffff' }} className="text-4xl font-black">{probability}%</span>
                                            <span style={{ color: '#64748b' }} className="text-[9px] font-bold uppercase tracking-widest mt-1">Risk Level</span>
                                        </div>
                                    </div>

                                    {/* KEY FACTORS */}
                                    <div className="space-y-5 mb-6">
                                        <p style={{ color: '#94a3b8' }} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Info size={12} /> Key Contributing Factors
                                        </p>
                                        <div className="space-y-4">
                                            {factors.map((f, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-[11px] font-bold uppercase">
                                                        <span style={{ color: '#cbd5e1' }}>{f.name}</span>
                                                        <span style={{ color: '#60a5fa' }}>{f.weight}%</span>
                                                    </div>
                                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} className="h-1.5 rounded-full overflow-hidden no-export">
                                                        <div style={{ width: `${f.weight}%`, backgroundColor: '#2563eb' }} className="h-full rounded-full transition-all duration-1000"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* EXPORT BUTTON */}
                        {result && (
                            <button
                                onClick={downloadPDF}
                                disabled={loading}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 shadow-lg disabled:opacity-50"
                            >
                                <FileDown size={20} /> Download Medical Report (PDF)
                            </button>
                        )}

                        {/* --- GUIDE CARD --- */}
                        <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-slate-100 shadow-sm mt-6">
                            <h4 className="text-slate-800 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertCircle size={16} className="text-blue-500" /> Patient Guide
                            </h4>
                            <ul className="space-y-3 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Pastikan Anda dalam kondisi istirahat (rileks) 5-10 menit sebelum input data.
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Gunakan alat pengukur tekanan darah (tensimeter) digital yang sudah terkalibrasi.
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Hindari konsumsi kafein atau merokok 30 menit sebelum melakukan pengecekan.
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Hasil AI ini adalah skrining awal, silakan konsultasi ke dokter untuk diagnosa medis.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Predict;