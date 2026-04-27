import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, HeartPulse, BrainCircuit, Loader2,
    AlertCircle, Info, FileDown, CheckCircle2, ArrowDown, HelpCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';

const Predict = () => {
    const reportRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [probability, setProbability] = useState(0);
    const [displayProb, setDisplayProb] = useState(0);
    const [factors, setFactors] = useState([]);
    const [formData, setFormData] = useState({
        gender: '', age: '', smoking: '',
        height: '', weight: '', systole: '', diastole: ''
    });

    const [bmi, setBmi] = useState(0);

    useEffect(() => {
        if (probability > 0) {
            let start = 0;
            const end = parseFloat(probability);
            const duration = 1000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setDisplayProb(end);
                    clearInterval(timer);
                } else {
                    setDisplayProb(parseFloat(start.toFixed(1)));
                }
            }, 16);
            return () => clearInterval(timer);
        } else {
            setDisplayProb(0);
        }
    }, [probability]);

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

    const getDynamicInsight = () => {
        if (!factors || factors.length === 0) return "Analyzing your clinical profile...";
        const topFactor = [...factors].sort((a, b) => b.weight - a.weight)[0];

        const narrations = {
            'Blood Pressure (Sys/Dia)': "Your blood pressure levels are the primary risk factors. The AI detected high pressure against your artery walls, requiring careful monitoring.",
            'BMI Analysis': "Your Body Mass Index (BMI) is a dominant contributor. Maintaining a healthy weight range is essential to reducing cardiac workload.",
            'Age Factor': "Age is a significant contributor in this analysis. Natural changes in vascular elasticity over time are influencing your risk profile.",
            'Smoking Status': "Smoking status is identified as a high-impact trigger. Chemical exposure from tobacco significantly narrows and stiffens blood vessels."
        };

        return narrations[topFactor.name] || `The ${topFactor.name} variable is currently the most significant factor affecting your health risk assessment.`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const payload = { ...formData, bmi: bmi };
            const response = await fetch('https://hypertension-pred-app.vercel.app/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Server connection failed');
            const data = await response.json();

            if (data.status === 'success') {
                const rawTotal = data.factors.reduce((sum, f) => sum + f.weight, 0);
                const translatedFactors = data.factors.map(f => {
                    let newName = f.name;
                    const label = f.name.toUpperCase();
                    if (label.includes('TEKANAN DARAH') || label.includes('SISTOLE')) {
                        newName = 'Blood Pressure';
                    } else if (label.includes('INDEKS MASSA TUBUH') || label.includes('IMT')) {
                        newName = 'Body Weight (BMI)';
                    } else if (label.includes('FAKTOR USIA') || label.includes('UMUR')) {
                        newName = 'Age Group';
                    } else if (label.includes('MEROKOK') || label.includes('SMOKING')) {
                        newName = 'Smoking Habit';
                    }
                    return { ...f, name: newName, tempWeight: (f.weight / rawTotal) * 100 };
                });

                let finalFactors = translatedFactors.map(f => ({ ...f, weight: Math.round(f.tempWeight) }));
                const currentTotal = finalFactors.reduce((sum, f) => sum + f.weight, 0);
                if (currentTotal !== 100 && finalFactors.length > 0) {
                    const diff = 100 - currentTotal;
                    const topIdx = finalFactors.reduce((iMax, x, i, arr) => x.weight > arr[iMax].weight ? i : iMax, 0);
                    finalFactors[topIdx].weight += diff;
                }

                setResult(data.result);
                setProbability(data.probability);
                setFactors(finalFactors);

                setTimeout(() => {
                    document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("Failed to connect to the AI Server.");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        const element = reportRef.current;
        if (!element) return;
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const dataUrl = await htmlToImage.toPng(element, {
                quality: 1.0,
                pixelRatio: 3,
                backgroundColor: '#0f172a',
                width: 1200,
                filter: (node) => {
                    return node.tagName !== 'IMG';
                },
                style: {
                    transform: 'scale(1)',
                    left: '0',
                    top: '0'
                }
            });

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const ratio = imgProps.width / imgProps.height;

            let finalWidth = pdfWidth - 20;
            let finalHeight = finalWidth / ratio;

            if (finalHeight > (pdfHeight - 20)) {
                finalHeight = pdfHeight - 20;
                finalWidth = finalHeight * ratio;
            }

            pdf.addImage(dataUrl, 'PNG', 10, 10, finalWidth, finalHeight);
            pdf.save(`Hypertensify_Report_${formData.age || 'Patient'}.pdf`);

        } catch (error) {
            console.error("PDF Export Failed:", error);
            alert("Gagal mengunduh. Gunakan Google Chrome.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 md:py-12 px-4 md:px-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes heart-pulse {
                    0% { filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0)); }
                    50% { filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.6)); }
                    100% { filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0)); }
                }
                .pulse-red { animation: heart-pulse 2s infinite ease-in-out; }
            `}} />

            <div className="max-w-4xl mx-auto space-y-12">
                {/* --- STEP 1: INPUT FORM --- */}
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
                            <Activity size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">Step 1: Clinical Data</h2>
                            <p className="text-sm md:text-lg text-slate-500 font-medium">Input clinical parameters for Random Forest PSO analysis</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm md:text-base font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                                    <select name="gender" required onChange={handleInputChange} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-lg md:text-xl text-slate-700 appearance-none cursor-pointer">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm md:text-base font-black text-slate-500 uppercase tracking-widest ml-1">Age (Years)</label>
                                    <input type="number" name="age" placeholder="e.g. 45" required onChange={handleInputChange} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-lg md:text-xl focus:ring-2 focus:ring-blue-500 transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm md:text-base font-black text-slate-500 uppercase tracking-widest ml-1">Height (cm)</label>
                                    <input type="number" name="height" placeholder="170" required onChange={handleInputChange} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-lg md:text-xl" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm md:text-base font-black text-slate-500 uppercase tracking-widest ml-1">Weight (kg)</label>
                                    <input type="number" name="weight" placeholder="70" required onChange={handleInputChange} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-lg md:text-xl" />
                                </div>
                                <div className="space-y-3 col-span-2 md:col-span-1">
                                    <label className="text-sm md:text-base font-black text-blue-500 uppercase tracking-widest ml-1">Auto BMI Score</label>
                                    <div className="w-full p-5 bg-blue-50 border border-blue-200 rounded-2xl font-black text-blue-600 flex items-center justify-center text-2xl md:text-3xl shadow-inner">
                                        {bmi > 0 ? bmi : '--'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                                <div className="space-y-3">
                                    <label className="text-sm md:text-base font-black text-slate-500 uppercase tracking-widest ml-1">Smoking Status</label>
                                    <select name="smoking" required onChange={handleInputChange} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-lg md:text-xl cursor-pointer">
                                        <option value="">Select Status</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm md:text-base font-black uppercase tracking-widest ml-1 text-red-500/80 flex items-center gap-1.5">
                                        Systole (mmHg) <Info size={18} className="text-slate-400" />
                                    </label>
                                    <input type="number" name="systole" placeholder="120" required onChange={handleInputChange} className="w-full p-5 bg-red-50/20 border border-red-100 rounded-2xl outline-none font-bold text-xl md:text-2xl text-red-700 focus:ring-2 focus:ring-red-500" />
                                    <p className="text-[11px] md:text-[13px] text-slate-400 font-bold ml-1 leading-tight uppercase">Upper number. Pressure when heart beats. Normal: &lt;120.</p>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm md:text-base font-black uppercase tracking-widest ml-1 text-red-500/80 flex items-center gap-1.5">
                                        Diastole (mmHg) <Info size={18} className="text-slate-400" />
                                    </label>
                                    <input type="number" name="diastole" placeholder="80" required onChange={handleInputChange} className="w-full p-5 bg-red-50/20 border border-red-100 rounded-2xl outline-none font-bold text-xl md:text-2xl text-red-700 focus:ring-2 focus:ring-red-500" />
                                    <p className="text-[11px] md:text-[13px] text-slate-400 font-bold ml-1 leading-tight uppercase">Lower number. Pressure when heart rests. Normal: &lt;80.</p>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-7 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xl md:text-2xl flex justify-center items-center gap-4 active:scale-95 transition-all shadow-xl">
                                {loading ? <><Loader2 className="animate-spin" size={32} /> Analyzing...</> : <><BrainCircuit size={32} /> Get AI Prediction</>}
                            </button>
                        </form>
                    </div>
                </section>

                {/* --- STEP 2: RESULT SECTION (RESTRUCTURED) --- */}
                <div id="result-section" className={`space-y-8 transition-all duration-1000 ${result ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 h-0 overflow-hidden'}`}>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg">
                            <CheckCircle2 size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">Step 2: AI Analysis Result</h2>
                            <p className="text-sm md:text-lg text-slate-500 font-medium">Based on the Hypertensify PSO-RF intelligent engine</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* --- THE MAIN RESULT BOX --- */}
                        <div id="result-card" ref={reportRef} style={{ backgroundColor: '#0f172a', color: '#ffffff' }} className="p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
                            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 relative z-10">

                                {/* Gauge Probabilitas */}
                                <div className="relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 flex-shrink-0 mx-auto">
                                    <svg className={`w-full h-full transform -rotate-90 ${probability > 70 ? 'pulse-red' : ''}`} viewBox="0 0 192 192">
                                        <circle cx="96" cy="96" r="85" stroke="#1e293b" strokeWidth="14" fill="transparent" />
                                        <circle cx="96" cy="96" r="85"
                                            stroke={probability > 50 ? '#ef4444' : '#10b981'}
                                            strokeWidth="16" fill="transparent"
                                            strokeDasharray={534}
                                            strokeDashoffset={534 - (534 * probability) / 100}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                                        <span className="font-black italic text-white whitespace-nowrap leading-none tracking-tighter" style={{ fontSize: displayProb >= 100 ? '2.8rem' : '3.4rem' }}>
                                            {displayProb}%
                                        </span>
                                        {/* Perubahan Ukuran dan Warna Dinamis pada Risk Prob */}
                                        <span
                                            style={{ color: probability > 50 ? '#ef4444' : '#10b981' }}
                                            className="text-sm md:text-lg font-black uppercase tracking-widest mt-2"
                                        >
                                            Risk Prob
                                        </span>
                                    </div>
                                </div>

                                {/* Analisis Teks & Bar Faktor */}
                                <div className="flex-grow w-full space-y-8">
                                    <div className="space-y-4">
                                        <h3 style={{ color: '#60a5fa' }} className="text-base md:text-lg font-black uppercase tracking-[0.2em]">Medical Insight</h3>
                                        <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed">
                                            Our AI analysis shows that <span className="text-white font-bold">{getDynamicInsight()}</span>
                                        </p>
                                    </div>
                                    <div className="space-y-5">
                                        {factors.map((f, i) => (
                                            <div key={i} className="space-y-2.5">
                                                <div className="flex justify-between text-xs md:text-base font-black uppercase tracking-tight">
                                                    <span style={{ color: '#94a3b8' }}>{f.name}</span>
                                                    {/* Bahasa Awam: Influence -> Impact */}
                                                    <span style={{ color: '#60a5fa' }}>{f.weight}% Impact</span>
                                                </div>
                                                <div style={{ backgroundColor: '#1e293b' }} className="h-2 md:h-3 rounded-full overflow-hidden">
                                                    <div style={{ width: `${f.weight}%`, backgroundColor: '#3b82f6' }} className="h-full rounded-full transition-all duration-1000"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Engine Info */}
                            <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                                <div className="text-[12px] md:text-[14px] font-bold text-slate-500 uppercase tracking-widest">
                                    Hypertensify AI Engine
                                </div>
                            </div>
                        </div>

                        {/* --- DOWNLOAD & DISCLAIMER (NOW BELOW THE BOX) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col justify-center">
                                <h4 className="text-slate-800 text-xs md:text-sm font-black uppercase tracking-widest mb-5 flex items-center gap-2"><AlertCircle size={18} className="text-blue-500" /> Medical Disclaimer</h4>
                                <ul className="space-y-4 text-xs md:text-[13px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                                    <li className="flex gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />This result is an initial AI-based screening.</li>
                                    <li className="flex gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />Consult a physician immediately if high risk is detected.</li>
                                </ul>
                            </div>
                            <button onClick={downloadPDF} disabled={loading} className="w-full py-7 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl font-black text-lg md:text-xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-xl">
                                <FileDown size={32} /> Download Report
                            </button>
                        </div>
                    </div>
                </div>

                {!result && !loading && (
                    <div className="py-12 text-center text-slate-400 font-bold text-[12px] md:text-[14px] uppercase tracking-[0.3em] flex flex-col items-center gap-4">
                        <ArrowDown className="animate-bounce" size={24} /> Please complete the medical form above
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predict;