import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, HeartPulse, User, Ruler,
    Weight, Cigarette, BrainCircuit, Loader2,
    Clock, AlertCircle, ChevronRight, Info, FileDown
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
            // Kita kirim formData asli + nilai BMI yang sudah dihitung
            const payload = { ...formData, bmi: bmi };

            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Server connection failed');
            }

            const data = await response.json();

            if (data.status === 'success') {
                setResult(data.result);           // 'High Risk' atau 'Low Risk'
                setProbability(data.probability); // Angka 0-100
                setFactors(data.factors);         // Insight dari AI

                // Auto-scroll ke hasil di Mobile
                if (window.innerWidth < 1024) {
                    setTimeout(() => {
                        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            console.error("API Error:", error);
            alert("Gagal terhubung ke AI Server. Pastikan Flask (app.py) sudah dijalankan.");
        } finally {
            setLoading(false);
        }
    };

    // FUNGSI EXPORT PDF
    const downloadPDF = () => {
        const element = reportRef.current;
        // Kita gunakan scale: 2 untuk hasil print yang tajam/HD
        html2canvas(element, { scale: 2, backgroundColor: '#0f172a' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Hypertensify_Report_${formData.age}yrs.pdf`);
        });
    };

    return (
        <div className="py-8 md:py-16 px-4 md:px-6 bg-slate-50 min-h-screen animate-in fade-in duration-700">
            <div className="max-w-6xl mx-auto">

                <div className="lg:hidden text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-800">Health Assessment</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">AI Analysis Tool</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start">

                    {/* --- LEFT: INPUT FORM --- */}
                    <div className="w-full lg:flex-[1.5] bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                                    <select name="gender" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium text-slate-600 appearance-none focus:ring-2 focus:ring-blue-500 transition-all">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age (Years)</label>
                                    <input type="number" name="age" placeholder="Ex: 45" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-blue-500 transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Height (cm)</label>
                                    <input type="number" name="height" placeholder="170" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Weight (kg)</label>
                                    <input type="number" name="weight" placeholder="70" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium" />
                                </div>
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Result BMI</label>
                                    <div className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl font-black text-blue-600 flex items-center justify-center text-xl">
                                        {bmi > 0 ? bmi : '--'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-6 border-t border-slate-50">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Smoking</label>
                                    <select name="smoking" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium appearance-none">
                                        <option value="">Status</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-2 text-red-600">
                                    <label className="text-xs font-bold uppercase tracking-wider ml-1">Systole</label>
                                    <input type="number" name="systole" placeholder="120" required onChange={handleInputChange} className="w-full p-4 bg-red-50/30 border border-red-100 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-red-500 transition-all" />
                                </div>
                                <div className="space-y-2 text-red-600">
                                    <label className="text-xs font-bold uppercase tracking-wider ml-1">Diastole</label>
                                    <input type="number" name="diastole" placeholder="80" required onChange={handleInputChange} className="w-full p-4 bg-red-50/30 border border-red-100 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-red-500 transition-all" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-3">
                                {loading ? <><Loader2 className="animate-spin" /> Processing AI...</> : <><BrainCircuit size={24} /> Get AI Prediction</>}
                            </button>
                        </form>
                    </div>

                    {/* --- RIGHT: ANALYSIS RESULT & EXPORT --- */}
                    <div className="w-full lg:flex-1 space-y-6">
                        <div id="result-card" ref={reportRef} className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden min-h-[400px]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                            <h3 className="text-lg font-bold mb-8 flex items-center gap-2 relative z-10 text-blue-400 uppercase tracking-widest">
                                <HeartPulse size={20} /> Analysis Result
                            </h3>

                            {!result ? (
                                <div className="py-20 text-center space-y-4 relative z-10">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                        <Info className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px] mx-auto opacity-60">
                                        Data belum diproses. Silakan klik tombol analisa.
                                    </p>
                                </div>
                            ) : (
                                <div className="animate-in zoom-in duration-500 relative z-10">
                                    <div className="relative w-40 h-40 mb-8 mx-auto flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                                                strokeDasharray={440}
                                                strokeDashoffset={440 - (440 * probability) / 100}
                                                className={`transition-all duration-1000 ease-out ${probability > 50 ? 'text-red-500' : 'text-green-500'}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-4xl font-black leading-none">{probability}%</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Prob</span>
                                        </div>
                                    </div>

                                    <div className={`py-3 px-6 rounded-2xl mb-8 text-center font-black text-xl uppercase tracking-tighter border ${result === 'High Risk' ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-green-500/10 text-green-500 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'}`}>
                                        {result}
                                    </div>

                                    <div className="space-y-5 mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Info size={12} /> Key Contributing Factors
                                        </p>
                                        <div className="space-y-4">
                                            {factors.map((f, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-[11px] font-bold">
                                                        <span className="text-slate-300">{f.name}</span>
                                                        <span className="text-blue-400">{f.weight}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${f.weight}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {result && (
                            <button onClick={downloadPDF} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg">
                                <FileDown size={20} /> Download Medical Report (PDF)
                            </button>
                        )}

                        <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-slate-100 shadow-sm text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            <h4 className="text-slate-800 mb-4 flex items-center gap-2"><AlertCircle size={16} className="text-blue-500" /> Patient Guide</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-blue-500" /> Pastikan data medis akurat</li>
                                <li className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-blue-500" /> Gunakan tensimeter digital</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Predict;