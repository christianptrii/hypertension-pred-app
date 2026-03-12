import React, { useState, useEffect } from 'react';
import {
    Activity, HeartPulse, User, Ruler,
    Weight, Cigarette, BrainCircuit, Loader2,
    Clock, AlertCircle, ChevronRight, Info
} from 'lucide-react';

const Predict = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [factors, setFactors] = useState([]); // State baru untuk menyimpan faktor
    const [formData, setFormData] = useState({
        gender: '',
        age: '',
        smoking: '',
        height: '',
        weight: '',
        systole: '',
        diastole: ''
    });

    const [bmi, setBmi] = useState(0);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        setTimeout(() => {
            setLoading(false);
            setResult('High Risk');
            // Simulasi faktor yang mempengaruhi (Feature Importance)
            // Nanti data ini akan dikirim oleh Flask berdasarkan model Random Forest mu
            setFactors([
                { name: 'Systole Level', weight: 85 },
                { name: 'Age Factor', weight: 65 },
                { name: 'BMI Index', weight: 45 },
            ]);
        }, 2000);
    };

    return (
        <div className="py-16 px-6 bg-slate-50 min-h-screen animate-in fade-in duration-700">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* --- LEFT: FORM CARD --- */}
                    <div className="flex-[2] bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Health Assessment</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Input Medical Variables</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <User size={16} className="text-blue-500" /> Gender
                                    </label>
                                    <select
                                        name="gender" required onChange={handleInputChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-600 appearance-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <Clock size={16} className="text-blue-500" /> Age (Years)
                                    </label>
                                    <input
                                        type="number" name="age" placeholder="Ex: 45" required
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <Ruler size={16} className="text-blue-500" /> Height (cm)
                                    </label>
                                    <input
                                        type="number" name="height" placeholder="170" required
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <Weight size={16} className="text-blue-500" /> Weight (kg)
                                    </label>
                                    <input
                                        type="number" name="weight" placeholder="70" required
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">BMI Result</label>
                                    <div className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl font-black text-blue-600 flex items-center justify-center">
                                        {bmi > 0 ? bmi : '--'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                                        <Cigarette size={16} className="text-blue-500" /> Smoking
                                    </label>
                                    <select
                                        name="smoking" required onChange={handleInputChange}
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-600 appearance-none"
                                    >
                                        <option value="">Status</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-red-600 ml-1">Systole</label>
                                    <input
                                        type="number" name="systole" placeholder="120" required
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-red-50/30 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-red-600 ml-1">Diastole</label>
                                    <input
                                        type="number" name="diastole" placeholder="80" required
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-red-50/30 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-3"
                            >
                                {loading ? (
                                    <> <Loader2 className="animate-spin" /> Processing AI... </>
                                ) : (
                                    <> <BrainCircuit size={22} /> Run Analysis Result </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* --- RIGHT: INFO & RESULT CARD --- */}
                    <div className="flex-1 space-y-6 w-full lg:max-w-xs">
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-colors"></div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                                <HeartPulse size={20} className="text-blue-500" /> Screening Result
                            </h3>

                            {!result ? (
                                <div className="space-y-4 relative z-10">
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Please fill out the form accurately. Our Random Forest model will analyze your cardiovascular risk based on your inputs.
                                    </p>
                                    <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                                </div>
                            ) : (
                                <div className="animate-in zoom-in duration-500 relative z-10">
                                    <div className={`p-6 rounded-3xl mb-6 text-center font-black text-2xl uppercase tracking-tighter shadow-inner ${result === 'High Risk' ? 'bg-red-500' : 'bg-green-500'}`}>
                                        {result}
                                    </div>

                                    {/* --- DYNAMIC FACTORS SECTION --- */}
                                    <div className="mt-8 mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                                            <Info size={12} /> Contributing Factors
                                        </p>
                                        <div className="space-y-4">
                                            {factors.map((f, i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-bold">
                                                        <span>{f.name}</span>
                                                        <span>{f.weight}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${f.weight}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-slate-500 italic leading-relaxed text-center">
                                        Disclaimer: This is for early screening only. Please visit a medical professional for clinical diagnosis.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-blue-200 transition-colors group">
                            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <AlertCircle size={18} className="text-blue-500" /> Guidelines
                            </h4>
                            <ul className="text-[11px] text-slate-500 space-y-4 font-bold uppercase tracking-widest">
                                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-500" /> Relax before measuring</li>
                                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-500" /> Accurate BP numbers</li>
                                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-blue-500" /> Consistent height/weight</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Predict;