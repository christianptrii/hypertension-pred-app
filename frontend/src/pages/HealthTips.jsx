import React from 'react';
import { Heart, Apple, Dumbbell, Moon, Wind, Coffee, AlertCircle } from 'lucide-react';

const HealthTips = () => {
    const tips = [
        {
            icon: <Apple className="text-red-500" size={32} />,
            title: "Healthy Diet",
            desc: "Reduce salt intake (sodium) and consume more fruits, vegetables, and whole grains. Follow the DASH diet for optimal heart health.",
            color: "bg-red-50"
        },
        {
            icon: <Dumbbell className="text-blue-500" size={32} />,
            title: "Regular Exercise",
            desc: "Aim for at least 150 minutes of moderate-intensity aerobic activity, such as brisk walking, per week.",
            color: "bg-blue-50"
        },
        {
            icon: <Moon className="text-indigo-500" size={32} />,
            title: "Quality Sleep",
            desc: "Ensure 7-9 hours of restful sleep daily. Poor sleep is linked to an increased risk of high blood pressure.",
            color: "bg-indigo-50"
        },
        {
            icon: <Wind className="text-teal-500" size={32} />,
            title: "Manage Stress",
            desc: "Practice mindfulness, deep breathing, or yoga to keep your stress levels—and blood pressure—in check.",
            color: "bg-teal-50"
        },
        {
            icon: <Coffee className="text-orange-500" size={32} />,
            title: "Limit Caffeine",
            desc: "Monitor your caffeine intake as it can cause short-term spikes in blood pressure for some people.",
            color: "bg-orange-50"
        },
        {
            icon: <Heart className="text-pink-500" size={32} />,
            title: "Monitor Regularly",
            desc: "Check your blood pressure at home and keep a log to share with your healthcare provider during visits.",
            color: "bg-pink-50"
        }
    ];

    return (
        <div className="py-12 md:py-24 px-4 md:px-6 bg-white animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto">
                {/* Header Section - Font Size disesuaikan dengan About/Home */}
                <div className="text-center mb-12 md:mb-20">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">
                        Heart-Healthy <span className="text-blue-600">Lifestyle</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium px-2 leading-relaxed">
                        Small changes today can lead to a lifetime of better cardiovascular health. Start your journey here.
                    </p>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {tips.map((tip, idx) => (
                        <div
                            key={idx}
                            className={`${tip.color} p-10 md:p-14 rounded-[30px] md:rounded-[45px] border border-white shadow-sm transition-all hover:-translate-y-2 duration-300 group`}
                        >
                            <div className="bg-white w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                {tip.icon}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 md:mb-6 tracking-tight">
                                {tip.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-base md:text-lg">
                                {tip.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* --- MEDICAL DISCLAIMER --- */}
                <div className="mt-20 md:mt-32 bg-slate-950 rounded-[35px] md:rounded-[50px] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    {/* Decorative Background Glow */}
                    <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px]"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center justify-center gap-3 tracking-tight">
                            <AlertCircle size={32} className="text-blue-500" /> Important Note
                        </h2>
                        <p className="text-slate-400 max-w-4xl mx-auto leading-relaxed italic text-base md:text-xl font-medium">
                            "The information provided here is for educational purposes only and should not be considered professional medical advice. Always consult with a doctor before making significant changes to your diet or exercise routine."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTips;