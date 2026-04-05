import React from 'react';
import {
    BookOpen, Database, BrainCircuit, Activity,
    FileText, Cpu, CheckCircle2, FlaskConical, ArrowRight
} from 'lucide-react';

const About = ({ onStart }) => {
    return (
        <div className="py-12 md:py-24 px-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* --- HEADER SECTION --- */}
                <section className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[0.2em] text-blue-600 bg-blue-50 border border-blue-100 rounded-2xl mb-4">
                        <FileText size={14} className="animate-pulse" />
                        <span className="uppercase">Scientific Background</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                        Rooted in Literature. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Engineered for Accuracy.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Hypertensify is a Clinical Decision Support System built upon peer-reviewed scientific journals and established Machine Learning methodologies for early hypertension risk detection.
                    </p>
                </section>

                {/* --- THE SCIENTIFIC PILLARS --- */}
                <div className="grid md:grid-cols-3 gap-8">
                    <TrustCard
                        icon={<Database className="text-blue-500" size={28} />}
                        title="Empirical Dataset"
                        desc="Trained using real-world Electronic Medical Records (EMR) to recognize complex and hidden clinical patterns."
                    />
                    <TrustCard
                        icon={<BookOpen className="text-indigo-500" size={28} />}
                        title="Superior Accuracy"
                        desc="Random Forest is scientifically proven to achieve superior accuracy, reaching up to 98.4% compared to traditional models."
                    />
                    <TrustCard
                        icon={<BrainCircuit className="text-emerald-500" size={28} />}
                        title="PSO Optimization"
                        desc="Particle Swarm Optimization is utilized to find optimal parameters, significantly minimizing diagnostic errors."
                    />
                </div>

                {/* --- SCIENTIFIC ARGUMENT (RANDOM FOREST) --- */}
                <section className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl shadow-slate-200/60 border border-slate-100 space-y-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Why Random Forest?</h2>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Based on Ho's research (1995), Random Forest works by building multiple decision trees to increase classification resilience against heterogeneous medical data.
                            </p>
                            <div className="space-y-4">
                                <StepCheck text="Prevents Overfitting through ensemble techniques." />
                                <StepCheck text="Handles complex non-linear data relationships." />
                                <StepCheck text="Effectively manages high-dimensional medical data." />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                            <div className="relative bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden group">
                                <FlaskConical className="text-blue-400 mb-4" size={40} />
                                <h3 className="text-white font-bold text-xl mb-2">PSO-RF Synergy</h3>
                                <p className="text-slate-400 text-sm leading-relaxed italic">
                                    "The integration of PSO into Random Forest automatically explores the parameter space to find the best configuration, minimizing human subjectivity."
                                </p>
                                <div className="absolute -bottom-4 -right-4 text-blue-500/10 transform rotate-12">
                                    <BookOpen size={120} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- CALL TO ACTION (FIXED NAVIGATION) --- */}
                <section className="text-center pb-12">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Test Scientific Accuracy Now</h3>
                    <div className="flex justify-center">
                        <button
                            onClick={onStart}
                            className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200 active:scale-95"
                        >
                            Start Screening <ArrowRight size={20} />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const TrustCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-lg shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
        <div className="mb-6 p-4 bg-slate-50 inline-block rounded-2xl">{icon}</div>
        <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
);

const StepCheck = ({ text }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
            <CheckCircle2 size={14} className="text-emerald-500" />
        </div>
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            {text}
        </span>
    </div>
);

export default About;