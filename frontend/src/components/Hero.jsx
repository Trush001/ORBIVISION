import React, { Suspense, lazy } from 'react';
import { 
  ArrowUpRight, Sparkles, CheckCircle2, 
  Activity, Zap, Cpu, ChevronDown
} from 'lucide-react';

const Hero3DCanvas = lazy(() => import('./Hero3DCanvas'));

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 flex flex-col justify-center overflow-hidden bg-grid-pattern">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Availability Pill & Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono backdrop-blur-md shadow-sm shadow-purple-900/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for New Projects</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/70 border border-white/[0.08] text-neutral-400 text-xs font-mono backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Creative Technology & AI Engineering</span>
          </div>
        </div>

        {/* Hero Grid: Typography + 3D Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & CTA (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl xl:text-7xl tracking-tight leading-[1.08] text-white">
              WE BUILD <br />
              <span className="text-gradient-purple">DIGITAL EXPERIENCES</span> <br />
              THAT MOVE BUSINESSES <br />
              <span className="text-gradient-cyan">FORWARD.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl">
              From powerful websites and mobile applications to intelligent AI automation, 
              we transform ideas into digital solutions that make a difference.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 cursor-pointer"
              >
                <span>Start Your Project</span>
                <ArrowUpRight className="w-5 h-5 text-sky-300" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-neutral-200 bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-md cursor-pointer"
              >
                <span>Explore Solutions</span>
              </a>
            </div>

            {/* Founders Micro-Badge */}
            <div className="mt-10 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Founders: <strong className="text-neutral-200 font-medium">Om Makwana</strong> & <strong className="text-neutral-200 font-medium">Trushal Parmar</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct Founder-Led Development</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>Fast Turnaround & Rapid Sprints</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Canvas Visual (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[500px]">
              
              {/* Outer Decorative Glow Frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-sky-500/30 rounded-3xl blur-xl opacity-70 pointer-events-none" />

              {/* Three.js Interactive 3D Sphere Canvas */}
              <div className="relative glass-panel rounded-2xl p-2 overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">
                    Interactive 3D Sphere
                  </span>
                </div>

                <div className="absolute top-3 right-4 z-20 text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-full">
                  WebGL Accelerated
                </div>

                <Suspense fallback={
                  <div className="w-full h-[420px] md:h-[540px] flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full border border-purple-500/40 animate-pulse flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-sky-400/40 animate-spin [animation-duration:4s]" />
                    </div>
                  </div>
                }>
                  <Hero3DCanvas />
                </Suspense>

                <div className="p-3 bg-[#0d0d14]/90 backdrop-blur-md rounded-xl border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">ORBIVISION Core Engine</p>
                    <p className="text-[11px] text-neutral-400">Interactive WebGL gyroscope node</p>
                  </div>
                  <span className="text-xs font-mono text-purple-400 font-semibold">Active Node</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Floating Glassmorphic Metric Cards Row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Custom AI & Automation */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex -space-x-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-[10px] font-bold text-white border-2 border-[#111116]">AI</span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-[10px] font-bold text-white border-2 border-[#111116]">LLM</span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-500 text-[10px] font-bold text-white border-2 border-[#111116]">RAG</span>
              </div>
            </div>

            <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
              Custom AI Automation
            </h3>
            <p className="text-sm text-neutral-400 mt-1 mb-4">
              Autonomous agents, fine-tuned LLM workflows, and intelligent business process robotics.
            </p>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300">
                Autonomous
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-sky-500/10 border border-sky-500/20 text-sky-300">
                API Access
              </span>
            </div>
          </div>

          {/* Card 2: Continuous Optimization & Scalability */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-300">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                99.98% SLA
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-2xl text-white">Sub-0.4s</span>
              <span className="text-xs text-neutral-400 font-mono">Response Speed</span>
            </div>
            
            {/* SVG Sparkline Chart */}
            <div className="my-3">
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,32 Q30,10 60,25 T120,8 T160,20 T200,5"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="5" r="4" fill="#38bdf8" className="animate-ping" />
                <circle cx="200" cy="5" r="3" fill="#ffffff" />
              </svg>
            </div>

            <h3 className="font-display font-semibold text-sm text-neutral-200">
              Continuous Performance Acceleration
            </h3>
          </div>

          {/* Card 3: Business Results & Growth */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-purple-300 font-medium">Strategic Impact</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-3xl text-gradient-purple">Bespoke</span>
              <span className="text-xs text-neutral-400">Engineering</span>
            </div>

            <p className="text-sm text-neutral-400 mt-2 mb-4">
              Engineered with clean UX architectures, resilient data layers, and custom digital workflows.
            </p>

            <a
              href="#services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              <span>Explore All Solutions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

      {/* Down arrow scroll hint */}
      <div className="mt-12 flex justify-center">
        <a 
          href="#services" 
          aria-label="Scroll to services"
          className="p-2 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-purple-500/50 transition-colors animate-bounce cursor-pointer"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
