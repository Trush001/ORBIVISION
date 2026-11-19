import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { PROCESS_STEPS } from '../data/constants';

export default function ProcessSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activeStep = PROCESS_STEPS[activeStepIndex];

  return (
    <section id="process" className="py-24 relative overflow-hidden bg-[#080808]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-purple-700/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Our Methodology</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            How We Turn Vision Into <br />
            <span className="text-gradient-purple">High-Impact Execution.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            A battle-tested 6-step lifecycle engineered to guarantee transparency, 
            rapid delivery, and zero scope drift.
          </p>
        </div>

        {/* Interactive Step Tabs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/50 scale-[1.02]'
                    : 'bg-neutral-900/40 border-white/[0.06] hover:border-white/20 hover:bg-neutral-900/80 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-xs font-bold ${isActive ? 'text-purple-300' : 'text-neutral-500'}`}>
                    {step.step}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />}
                </div>

                <div className={`text-xs font-display font-bold leading-tight ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                  {step.title.split(' ')[0]}
                </div>

                <div className="text-[10px] text-neutral-500 truncate mt-1">
                  {step.short}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Feature Showcase Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-purple-500/30 relative overflow-hidden shadow-2xl">
          {/* Subtle Cyber Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Step Details (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-2xl font-bold text-sky-400 bg-sky-950/60 px-3.5 py-1 rounded-xl border border-sky-500/30">
                  {activeStep.step}
                </span>
                <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
                  Phase {activeStep.step} of 06
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
                {activeStep.title}
              </h3>

              <p className="mt-2 text-sm font-mono text-sky-400">
                {activeStep.short}
              </p>

              <p className="mt-4 text-base text-neutral-300 leading-relaxed max-w-xl">
                {activeStep.description}
              </p>

              {/* Points */}
              <div className="mt-6 space-y-2.5">
                {activeStep.points.map((pt, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-white/10">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-neutral-900 border border-white/10 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800"
                >
                  ← Previous Phase
                </button>
                <button
                  disabled={activeStepIndex === PROCESS_STEPS.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(PROCESS_STEPS.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-purple-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-500 shadow-md shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <span>Next Phase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Visual Dashboard Widget (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b0b12] rounded-2xl p-6 border border-white/[0.08] shadow-inner space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-mono text-neutral-400">Milestone Telemetry</span>
                  <span className="text-xs font-mono text-emerald-400 font-medium">Sprint Active</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
                      <span>Phase Progress</span>
                      <span>{Math.round(((activeStepIndex + 1) / 6) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-sky-400 transition-all duration-500 rounded-full"
                        style={{ width: `${((activeStepIndex + 1) / 6) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5 text-xs">
                    <span className="text-neutral-500 block font-mono">Deliverables in this phase:</span>
                    <p className="text-neutral-200 font-medium">Weekly demo video, updated staging URL, GitHub pull request review & feedback iteration.</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-neutral-500">
                    <span>Direct WhatsApp Hotline</span>
                    <span className="text-sky-400 font-medium">Om & Trushal on-call</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
