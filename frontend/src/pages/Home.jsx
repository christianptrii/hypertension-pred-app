import React, { useState } from 'react';
import {
    Activity, ShieldCheck, Heart, ChevronDown,
    ChevronUp, HeartPulse, Stethoscope, Clock,
    AlertCircle, ArrowRight, UserCheck, Sparkles,
    User, Scale, Microscope
} from 'lucide-react';

const Home = ({ onStart }) => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            q: "Who should take this screening?",
            a: "Individuals who want to monitor their cardiovascular health, especially those with family history of hypertension, stressful lifestyles, or those who haven't had a check-up recently."
        },
        {
            q: "Is this assessment private?",
            a: "Yes. Your health data is processed instantly in your browser. We do not store any of your personal medical information on our servers."
        },
        {
            q: "What should I do with the results?",
            a: "If the result shows a high-risk category, we strongly recommend consulting a healthcare professional for a comprehensive clinical examination."
        }
    ];

    return (
        <div className="bg-white selection:bg-blue-100 selection:text-blue-600">
            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-32 px-6 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-70"></div>
                <div className="absolute bottom-0 left-[-5%] w-[500px] h-[500px] bg-red-50 rounded-full blur-[100px] -z-10 opacity-60"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-left relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-[0.2em] text-blue-600 uppercase bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-2xl animate-fade-in">
                            <Sparkles size={14} className="animate-pulse" /> AI Health Companion
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.95] tracking-tight">
                            Your Heart <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Deserves</span> <br />
                            to be Heard.
                        </h1>
                        <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium">
                            Don't wait for symptoms to appear. Use our intuitive AI-driven tool for a
                            private, instant, and accurate hypertension risk assessment today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <button
                                onClick={onStart}
                                className="group bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-12 rounded-2xl text-lg transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 hover:-translate-y-1"
                            >
                                Start Screening <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Attractive Visual Element: Updated to Glassmorphic Medical Card */}
                    <div className="hidden lg:flex justify-end relative">
                        <div className="relative group">
                            {/* Glassmorphic Card */}
                            <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[45px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 w-[400px] aspect-square relative z-20 flex flex-col justify-between overflow-hidden">
                                {/* Decorative Glows Inside Card */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl -z-10 opacity-50"></div>

                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                                        <HeartPulse size={32} />
                                    </div>
                                    <div className="text-right">
                                        <div className="h-2 w-16 bg-blue-100 rounded-full ml-auto mb-2 animate-pulse"></div>
                                        <div className="h-2 w-10 bg-slate-100 rounded-full ml-auto"></div>
                                    </div>
                                </div>

                                {/* Animated ECG Wave */}
                                <div className="my-4">
                                    <svg viewBox="0 0 100 20" className="w-full h-16 stroke-blue-500 stroke-[1.5] fill-none opacity-80">
                                        <path d="M0 10 h10 l2 -6 l2 12 l2 -10 l2 6 h10 l2 -6 l2 12 l2 -10 l2 6 h10 l2 -6 l2 12 l2 -10 l2 6 h10 v0" />
                                        {/* Scanning Effect Overlay */}
                                        <rect width="100" height="20" fill="url(#grad1)" className="animate-scan" />
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0 }} />
                                                <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0.8 }} />
                                                <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <p className="text-[10px] uppercase font-black text-slate-400 mt-2 tracking-[0.2em] text-center">Neural Health Analysis</p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <MetricIcon icon={<Microscope size={18} />} label="AI MODEL" />
                                    <MetricIcon icon={<User size={18} />} label="PATIENT" />
                                    <MetricIcon icon={<Scale size={18} />} label="METRICS" />
                                </div>
                            </div>

                            {/* Floating Badge (Detection Accuracy) */}
                            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 z-30 flex items-center gap-4 animate-bounce-slow">
                                <div className="p-3 bg-green-100 rounded-2xl text-green-600 font-black text-xl">92%</div>
                                <div className="pr-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Detection</p>
                                    <p className="text-xs font-bold text-slate-700 uppercase">Accuracy</p>
                                </div>
                            </div>

                            {/* Floating Ornaments */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-[30%] rotate-12 -z-10 opacity-40 animate-pulse"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full -z-10 mix-blend-multiply filter blur-2xl opacity-40"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CORE VALUES --- */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <AestheticCard
                        icon={<Clock className="text-blue-600" />}
                        title="Fast Result"
                        desc="Get your assessment in under 2 minutes with zero waiting time."
                        bgColor="bg-blue-50"
                    />
                    <AestheticCard
                        icon={<AlertCircle className="text-red-500" />}
                        title="Silent Warning"
                        desc="Understand potential risks before they turn into serious conditions."
                        bgColor="bg-red-50"
                    />
                    <AestheticCard
                        icon={<UserCheck className="text-indigo-600" />}
                        title="Your Privacy"
                        desc="We don't store data. Your medical inputs remain entirely private."
                        bgColor="bg-indigo-50"
                    />
                </div>
            </section>

            {/* --- ATTRACTIVE ABOUT --- */}
            <section id="about" className="py-32 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                    <div className="relative order-2 lg:order-1">
                        <div className="aspect-square bg-white rounded-[60px] shadow-2xl overflow-hidden p-8 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent"></div>
                            <Heart size={160} strokeWidth={0.5} className="text-blue-100 absolute scale-150 rotate-12" />
                            <Stethoscope size={120} strokeWidth={1.5} className="text-blue-600 relative z-10" />
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-5xl font-black text-slate-900 mb-10 tracking-tight leading-tight">
                            Early Detection <br />
                            <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Saves Lives.</span>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-10">
                            Hypertension is a global health challenge often referred to as the "silent killer." Our platform empowers you with AI-driven insights to help you navigate your health journey.
                        </p>
                        <ul className="space-y-6">
                            <ListItem text="Prevent chronic heart complications" />
                            <ListItem text="Monitor blood pressure trends easily" />
                            <ListItem text="Bridge the gap between you and your doctor" />
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-black text-slate-900 mb-16 text-center tracking-tight">Understanding Screening</h2>
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="group border-b border-slate-100 pb-6">
                                <button
                                    className="w-full flex justify-between items-center py-4 text-left font-bold text-slate-800 hover:text-blue-600 transition-colors"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                >
                                    <span className="text-2xl tracking-tight">{faq.q}</span>
                                    {openFaq === idx ? <ChevronUp size={24} /> : <ChevronDown size={24} className="text-slate-300" />}
                                </button>
                                {openFaq === idx && (
                                    <div className="pt-4 pb-2 text-slate-500 text-lg leading-relaxed animate-in slide-in-from-top-2 duration-300">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA --- */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-7xl mx-auto bg-gradient-to-r from-slate-900 to-slate-800 rounded-[60px] p-20 relative overflow-hidden shadow-3xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">Your Health Path Starts Here.</h2>
                    <p className="text-slate-400 text-xl mb-12 max-w-xl mx-auto leading-relaxed font-medium italic">
                        "Small screenings lead to big preventions."
                    </p>
                    <button
                        onClick={onStart}
                        className="bg-white text-slate-900 hover:bg-blue-50 font-black py-6 px-16 rounded-3xl text-xl transition-all shadow-xl active:scale-95"
                    >
                        START PREDICTION NOW
                    </button>
                </div>
            </section>
        </div>
    );
};

// Sub-components
const MetricIcon = ({ icon, label }) => (
    <div className="p-4 bg-white/60 rounded-2xl border border-white flex flex-col items-center justify-center gap-2">
        <div className="text-blue-500">{icon}</div>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
);

const AestheticCard = ({ icon, title, desc, bgColor }) => (
    <div className={`p-12 rounded-[40px] ${bgColor} transition-all hover:-translate-y-2 duration-500 group border border-white`}>
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform text-blue-600">
            {icon}
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
    </div>
);

const ListItem = ({ text }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <UserCheck size={12} />
        </div>
        <span className="text-slate-700 font-bold">{text}</span>
    </div>
);

export default Home;