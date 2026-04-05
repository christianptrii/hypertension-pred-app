import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, HeartPulse, BrainCircuit, Loader2,
    AlertCircle, Info, FileDown, CheckCircle2, ArrowDown, HelpCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Predict = () => {
    const reportRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [probability, setProbability] = useState(0);
    const [displayProb, setDisplayProb] = useState(0); // State untuk animasi angka
    const [factors, setFactors] = useState([]);
    const [formData, setFormData] = useState({
        gender: '', age: '', smoking: '',
        height: '', weight: '', systole: '', diastole: ''
    });

    const [bmi, setBmi] = useState(0);

    // Animasi Angka Menghitung (Counting Up)
    useEffect(() => {
        if (probability > 0) {
            let start = 0;
            const end = parseFloat(probability);
            const duration = 1000; // 1 detik
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
                        newName = 'Blood Pressure (Sys/Dia)';
                    } else if (label.includes('INDEKS MASSA TUBUH') || label.includes('IMT')) {
                        newName = 'BMI Analysis';
                    } else if (label.includes('FAKTOR USIA') || label.includes('UMUR')) {
                        newName = 'Age Factor';
                    } else if (label.includes('MEROKOK') || label.includes('SMOKING')) {
                        newName = 'Smoking Status';
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
            await new Promise(resolve => setTimeout(resolve, 500));
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#0f172a',
                useCORS: true,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('result-card');
                    if (el) {
                        el.style.backgroundColor = '#0f172a';
                        el.style.color = '#ffffff';
                        const allElements = el.getElementsByTagName("*");
                        for (let i = 0; i < allElements.length; i++) {
                            const node = allElements[i];
                            const computed = window.getComputedStyle(node);
                            if (computed.color.includes('okl')) node.style.color = '#ffffff';
                            if (computed.backgroundColor.includes('okl')) {
                                node.style.backgroundColor = node.className.includes('h-full') ? '#3b82f6' : 'transparent';
                            }
                            if (computed.borderColor.includes('okl')) node.style.borderColor = '#1e293b';
                        }
                    }
                }
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`Hypertensify_Report_${formData.age || 'Patient'}.pdf`);
        } catch (error) {
            console.error("PDF Export Failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const InputInfo = ({ title, desc }) => (
        <div className="group relative inline-block ml-1.5 cursor-help align-middle">
            <HelpCircle size={13} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-3 bg-slate-800 text-white text-[10px] rounded-xl shadow-2xl z-50 border border-slate-700 animate-in fade-in zoom-in duration-200">
                <p className="font-bold border-b border-white/10 pb-1 mb-1 text-blue-400">{title}</p>
                <p className="font-medium text-slate-300 leading-relaxed">{desc}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
            </div>
        </div>
    );

    return (
        <div className="py-8 md:py-12 px-4 md:px-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* Animasi Internal CSS */}
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
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-[#2563eb33]">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Step 1: Clinical Data</h2>
                            <p className="text-xs md:text-sm text-slate-500 font-medium">Input clinical parameters for Random Forest PSO analysis</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                                    <select name="gender" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 appearance-none cursor-pointer">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Age (Years)</label>
                                    <input type="number" name="age" placeholder="e.g. 45" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Height (cm)</label>
                                    <input type="number" name="height" placeholder="170" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Weight (kg)</label>
                                    <input type="number" name="weight" placeholder="70" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                                </div>
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <label className="text-xs font-black text-blue-500 uppercase tracking-widest ml-1">Auto BMI Score</label>
                                    <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-2xl font-black text-blue-600 flex items-center justify-center text-xl shadow-inner">
                                        {bmi > 0 ? bmi : '--'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Smoking Status</label>
                                    <select name="smoking" required onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold cursor-pointer">
                                        <option value="">Select Status</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                {/* Systole with Info Logo */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest ml-1 text-red-500/80 flex items-center gap-1.5">
                                        Systole (mmHg) <Info size={14} className="text-slate-400" />
                                    </label>
                                    <input type="number" name="systole" placeholder="120" required onChange={handleInputChange} className="w-full p-4 bg-red-50/20 border border-red-100 rounded-2xl outline-none font-bold text-red-700 focus:ring-2 focus:ring-red-500" />
                                    <p className="text-[10px] text-slate-400 font-bold ml-1 leading-tight uppercase">Upper number. Pressure when heart beats. Normal: &lt;120.</p>
                                </div>

                                {/* Diastole with Info Logo */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest ml-1 text-red-500/80 flex items-center gap-1.5">
                                        Diastole (mmHg) <Info size={14} className="text-slate-400" />
                                    </label>
                                    <input type="number" name="diastole" placeholder="80" required onChange={handleInputChange} className="w-full p-4 bg-red-50/20 border border-red-100 rounded-2xl outline-none font-bold text-red-700 focus:ring-2 focus:ring-red-500" />
                                    <p className="text-[10px] text-slate-400 font-bold ml-1 leading-tight uppercase">Lower number. Pressure when heart rests. Normal: &lt;80.</p>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xl flex justify-center items-center gap-4 active:scale-95 transition-all shadow-xl">
                                {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><BrainCircuit size={28} /> Get AI Prediction</>}
                            </button>
                        </form>
                    </div>
                </section>

                <div id="result-section" className={`space-y-6 transition-all duration-1000 ${result ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 h-0 overflow-hidden'}`}>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Step 2: AI Analysis Result</h2>
                            <p className="text-xs md:text-sm text-slate-500 font-medium">Based on the Hypertensify PSO-RF intelligent engine</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="w-full lg:flex-[3]">
                            <div id="result-card" ref={reportRef} style={{ backgroundColor: '#0f172a', color: '#ffffff' }} className="p-6 md:p-12 rounded-[30px] md:rounded-[40px] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
                                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">

                                    <div className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 flex-shrink-0 mx-auto">
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
                                            <span className="font-black italic text-white whitespace-nowrap leading-none tracking-tighter" style={{ fontSize: displayProb >= 100 ? '2.4rem' : '2.8rem' }}>
                                                {displayProb}%
                                            </span>
                                            <span style={{ color: '#64748b' }} className="text-[10px] font-bold uppercase tracking-widest mt-2">Risk Prob</span>
                                        </div>
                                    </div>

                                    <div className="flex-grow w-full space-y-6">
                                        <div className="space-y-3">
                                            <h3 style={{ color: '#60a5fa' }} className="text-sm font-black uppercase tracking-[0.2em]">Key Insights</h3>
                                            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                                                Based on the Random Forest algorithm optimized with PSO, <span className="text-white">{getDynamicInsight()}</span>
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            {factors.map((f, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                                                        <span style={{ color: '#94a3b8' }}>{f.name}</span>
                                                        <span style={{ color: '#60a5fa' }}>{f.weight}% Influence</span>
                                                    </div>
                                                    <div style={{ backgroundColor: '#1e293b' }} className="h-1.5 rounded-full overflow-hidden">
                                                        <div style={{ width: `${f.weight}%`, backgroundColor: '#3b82f6' }} className="h-full rounded-full transition-all duration-1000"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Hypertensify AI Engine
                                    </div>
                                    <img src="/logo-brand.png" alt="" className="h-6 opacity-30 grayscale" />
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:flex-1 space-y-4">
                            <button onClick={downloadPDF} disabled={loading} className="w-full py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl font-black text-sm flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-xl">
                                <FileDown size={28} /> Download Report
                            </button>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h4 className="text-slate-800 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle size={14} className="text-blue-500" /> Medical Disclaimer</h4>
                                <ul className="space-y-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />This result is an initial AI-based screening.</li>
                                    <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />Consult a physician immediately if high risk is detected.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {!result && !loading && (
                    <div className="py-10 text-center text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-3">
                        <ArrowDown className="animate-bounce" /> Please complete the medical form above
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predict;