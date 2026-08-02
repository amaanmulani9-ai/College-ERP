import React, { useState } from "react";
import { Sparkles, CheckCircle2, ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";

export const MobileOnboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDES = [
    { title: "Welcome to Mobile ERP", desc: "Access full institutional management, admissions, and financial analytics on your phone.", icon: "🚀" },
    { title: "Touch Workspace & Quick Launcher", desc: "Swipe between open tabs, pin favorite modules, and run 56px quick action tiles.", icon: "📱" },
    { title: "Offline PWA & Background Sync", desc: "Scan attendance and collect receipts offline — changes sync automatically when back online.", icon: "⚡" },
    { title: "AI Copilot Assistant", desc: "Ask AI Copilot to summarize fee overdues, generate notices, and analyze student trends.", icon: "✨" },
  ];

  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 font-sans text-xs select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-xs">Mobile Onboarding Tour</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">{currentSlide + 1} / {SLIDES.length}</span>
      </div>

      {/* Slide Card */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
        <div className="text-4xl py-2">{SLIDES[currentSlide].icon}</div>
        <h4 className="font-bold text-slate-100 text-sm">{SLIDES[currentSlide].title}</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">{SLIDES[currentSlide].desc}</p>
      </div>

      {/* Slide Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
          disabled={currentSlide === 0}
          className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Carousel Dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? "w-5 bg-indigo-500" : "w-1.5 bg-slate-700"}`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={() => setCurrentSlide(0)}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px]"
          >
            <RotateCcw className="w-3 h-3" /> Replay
          </button>
        ) : (
          <button
            onClick={() => setCurrentSlide((p) => Math.min(SLIDES.length - 1, p + 1))}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const MobileTour: React.FC = () => {
  return <MobileOnboarding />;
};
