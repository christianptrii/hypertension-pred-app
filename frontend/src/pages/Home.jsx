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
            <section className="relative pt-12 md:pt-24 pb-20 md:pb-32 px-6 overflow-hidden">
                {/* Background Decor - z-index diturunkan agar tidak menghalangi klik atau teks */}
                <div className="absolute top-[-5%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-50 rounded-full blur-[80px] md:blur-[120px] -z-10 opacity-70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-red-50 rounded-full blur-[80px] md:blur-[100px] -z-10 opacity-60 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                    {/* Konten Teks */}
                    <div className="text-center lg:text-left relative z-20">
                        {/* Perbaikan Badge: flex-wrap dan whitespace-normal agar tidak terpotong di mobile */}
                        <div className="flex justify-center lg:justify-start mb-6 md:mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] text-blue-600 uppercase bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-2xl animate-fade-in whitespace-normal text-center leading-tight">
                                <Sparkles size={14} className="animate-pulse shrink-0" />
                                <span>AI Health Companion</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 md:mb-8 leading-[1.1] md:leading-[0.95] tracking-tight">
                            Your Heart <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Deserves</span> <br className="hidden md:block" />
                            to be Heard.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-500 mb-8 md:mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                            Don't wait for symptoms to appear. Use our intuitive AI-driven tool for a
                            private, instant, and accurate hypertension risk assessment today.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-5">
                            <button
                                onClick={onStart}
                                className="group bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 md:py-5 px-8 md:px-12 rounded-2xl text-base md:text-lg transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 hover:-translate-y-1"
                            >
                                Start Screening <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Visual Element - Glassmorphic Card (Hanya muncul di desktop) */}
                    <div className="hidden lg:flex justify-end relative z-20">
                        <div className="relative group">
                            <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[45px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 w-[400px] aspect-square relative z-30 flex flex-col justify-between overflow-hidden">
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

                                <div className="my-4">
                                    <svg viewBox="0 0 100 20" className="w-full h-16 stroke-blue-500 stroke-[1.5] fill-none opacity-80">
                                        <path d="M0 10 h10 l2 -6 l2 12 l2 -10 l2 6 h10 l2 -6 l2 12 l2 -10 l2 6 h10 l2 -6 l2 12 l2 -10 l2 6 h10 v0" />
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

                            {/* Floating Ornaments */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-[30%] rotate-12 z-20 opacity-40 animate-pulse"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full z-20 mix-blend-multiply filter blur-2xl opacity-40"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CORE VALUES --- */}
            <section className="py-16 md:py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
            <section id="about" className="py-16 md:py-32 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="relative order-2 lg:order-1 flex justify-center lg:block">
                        <div className="w-full max-w-[300px] md:max-w-full aspect-square bg-white rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden p-8 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent"></div>
                            <Heart size={160} strokeWidth={0.5} className="text-blue-100 absolute scale-125 md:scale-150 rotate-12" />
                            <Stethoscope size={80} md:size={120} strokeWidth={1.5} className="text-blue-600 relative z-10" />
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 md:mb-10 tracking-tight leading-tight">
                            Early Detection <br />
                            <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Saves Lives.</span>
                        </h2>
                        <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 md:mb-10">
                            Hypertension is a global health challenge often referred to as the "silent killer." Our platform empowers you with AI-driven insights to help you navigate your health journey.
                        </p>
                        <ul className="space-y-4 md:space-y-6 text-left inline-block lg:block">
                            <ListItem text="Prevent chronic heart complications" />
                            <ListItem text="Monitor blood pressure trends easily" />
                            <ListItem text="Bridge the gap between you and your doctor" />
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-16 md:py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 md:mb-16 text-center tracking-tight">Understanding Screening</h2>
                    <div className="space-y-4 md:space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="group border-b border-slate-100 pb-4 md:pb-6">
                                <button
                                    className="w-full flex justify-between items-center py-4 text-left font-bold text-slate-800 hover:text-blue-600 transition-colors"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                >
                                    <span className="text-lg md:text-2xl tracking-tight pr-4">{faq.q}</span>
                                    {openFaq === idx ? <ChevronUp size={24} className="shrink-0" /> : <ChevronDown size={24} className="text-slate-300 shrink-0" />}
                                </button>
                                {openFaq === idx && (
                                    <div className="pt-4 pb-2 text-slate-500 text-base md:text-lg leading-relaxed animate-in slide-in-from-top-2 duration-300">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA --- */}
            <section className="py-12 md:py-32 px-6 text-center">
                <div className="max-w-7xl mx-auto bg-gradient-to-r from-slate-900 to-slate-800 rounded-[30px] md:rounded-[60px] p-10 md:p-20 relative overflow-hidden shadow-3xl">
                    <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-blue-500/10 rounded-full blur-[60px] md:blur-[100px]"></div>
                    <h2 className="text-3xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tighter">Your Health Path Starts Here.</h2>
                    <p className="text-slate-400 text-base md:text-xl mb-8 md:mb-12 max-w-xl mx-auto leading-relaxed font-medium italic">
                        "Small screenings lead to big preventions."
                    </p>
                    <button
                        onClick={onStart}
                        className="w-full sm:w-auto bg-white text-slate-900 hover:bg-blue-50 font-black py-4 md:py-6 px-10 md:px-16 rounded-2xl md:rounded-3xl text-lg md:text-xl transition-all shadow-xl active:scale-95"
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
    <div className="p-2 md:p-4 bg-white/60 rounded-xl md:rounded-2xl border border-white flex flex-col items-center justify-center gap-2">
        <div className="text-blue-500">{icon}</div>
        <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
);

const AestheticCard = ({ icon, title, desc, bgColor }) => (
    <div className={`p-8 md:p-12 rounded-[30px] md:rounded-[40px] ${bgColor} transition-all hover:-translate-y-2 duration-500 group border border-white`}>
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-sm group-hover:scale-110 transition-transform text-blue-600">
            {icon}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">{title}</h3>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">{desc}</p>
    </div>
);

const ListItem = ({ text }) => (
    <div className="flex items-center gap-3 md:gap-4 group">
        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <UserCheck size={12} />
        </div>
        <span className="text-sm md:text-base text-slate-700 font-bold">{text}</span>
    </div>
);

export default Home;