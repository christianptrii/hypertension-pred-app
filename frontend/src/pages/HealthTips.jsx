import React from 'react';
import { Heart, Apple, Dumbbell, Moon, Wind, Coffee } from 'lucide-react';

const HealthTips = () => {
    const tips = [
        {
            icon: <Apple className="text-red-500" />,
            title: "Healthy Diet",
            desc: "Reduce salt intake (sodium) and consume more fruits, vegetables, and whole grains. Follow the DASH diet for optimal heart health.",
            color: "bg-red-50"
        },
        {
            icon: <Dumbbell className="text-blue-500" />,
            title: "Regular Exercise",
            desc: "Aim for at least 150 minutes of moderate-intensity aerobic activity, such as brisk walking, per week.",
            color: "bg-blue-50"
        },
        {
            icon: <Moon className="text-indigo-500" />,
            title: "Quality Sleep",
            desc: "Ensure 7-9 hours of restful sleep daily. Poor sleep is linked to an increased risk of high blood pressure.",
            color: "bg-indigo-50"
        },
        {
            icon: <Wind className="text-teal-500" />,
            title: "Manage Stress",
            desc: "Practice mindfulness, deep breathing, or yoga to keep your stress levels—and blood pressure—in check.",
            color: "bg-teal-50"
        },
        {
            icon: <Coffee className="text-orange-500" />,
            title: "Limit Caffeine",
            desc: "Monitor your caffeine intake as it can cause short-term spikes in blood pressure for some people.",
            color: "bg-orange-50"
        },
        {
            icon: <Heart className="text-pink-500" />,
            title: "Monitor Regularly",
            desc: "Check your blood pressure at home and keep a log to share with your healthcare provider during visits.",
            color: "bg-pink-50"
        }
    ];

    return (
        <div className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Heart-Healthy <span className="text-blue-600">Lifestyle</span></h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Small changes today can lead to a lifetime of better cardiovascular health. Start your journey here.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tips.map((tip, idx) => (
                        <div key={idx} className={`${tip.color} p-10 rounded-[40px] border border-white shadow-sm transition-all hover:-translate-y-2 duration-300 group`}>
                            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                {tip.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-4">{tip.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm">{tip.desc}</p>
                        </div>
                    ))}
                </div>

                {/* --- MEDICAL DISCLAIMER --- */}
                <div className="mt-20 bg-slate-950 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
                    <h2 className="text-2xl font-bold mb-4">Important Note</h2>
                    <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed italic">
                        "The information provided here is for educational purposes only and should not be considered professional medical advice. Always consult with a doctor before making significant changes to your diet or exercise routine."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HealthTips;