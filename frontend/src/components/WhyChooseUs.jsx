import React, { useState } from 'react';
import { 
  Users, Code, Lightbulb, TrendingUp, ShieldCheck, Clock, 
  CheckCircle2, Sparkles
} from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/constants';

const ICON_MAP = {
  Users: Users,
  Code: Code,
  Lightbulb: Lightbulb,
  TrendingUp: TrendingUp,
  ShieldCheck: ShieldCheck,
  Clock: Clock
};

export default function WhyChooseUs() {
  const [showComparison, setShowComparison] = useState(false);

  const comparisonData = [
    {
      feature: "Direct Founder Engineering",
      orbivision: "100% Direct with Om & Trushal",
      traditional: "Delegated to junior devs",
      freelancers: "Single point of failure"
    },
    {
      feature: "Modern Tech Stack",
      orbivision: "React 19, FastAPI, Three.js & AI",
      traditional: "Legacy WordPress/Drupal/PHP",
      freelancers: "Inconsistent quality"
    },
    {
      feature: "Turnaround & Speed",
      orbivision: "Agile 1-2 week sprint releases",
      traditional: "Months of bureaucracy",
      freelancers: "Unpredictable delivery"
    },
    {
      feature: "Integrated AI Automation",
      orbivision: "Bespoke LLMs & n8n agents included",
      traditional: "Expensive custom add-on",
      freelancers: "Rarely supported"
    },
    {
      feature: "Scope & Proposal Transparency",
      orbivision: "Custom tailored roadmaps & verified milestones",
      traditional: "Inflated retainers & overhead",
      freelancers: "Scope creep risk"
    }
  ];

  return (
    <section id="why-us" className="py-24 relative overflow-hidden bg-[#080808]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono uppercase tracking-widest mb-4">
              <span>The Agency Advantage</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              Small Team. Big Ideas. <br />
              <span className="text-gradient-cyan">Powerful Execution.</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-neutral-400">
              We eliminated bureaucratic agency bloat and junior delegation. When you partner with ORBIVISION,
              you get direct access to two obsessed technologists focused exclusively on your growth.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium border border-white/10 hover:border-purple-500/40 bg-neutral-900/60 text-neutral-300 hover:text-white transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{showComparison ? "Hide Comparison" : "Compare with Traditional Agencies"}</span>
            </button>
          </div>
        </div>

        {/* 6 High Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => {
            const Icon = ICON_MAP[item.icon] || Users;
            return (
              <div 
                key={idx}
                className="group glass-panel rounded-2xl p-7 relative overflow-hidden transition-all duration-300 hover:border-purple-500/35 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/30"
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Agency Comparison Matrix Modal / Drawer */}
        {showComparison && (
          <div className="mt-12 glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 overflow-x-auto animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  Why ORBIVISION Wins the Agency Equation
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Direct head-to-head architectural & delivery comparison
                </p>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
                Transparent Benchmark
              </span>
            </div>

            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono text-neutral-400">
                  <th className="py-3 px-4">Evaluation Metric</th>
                  <th className="py-3 px-4 text-purple-400 font-bold bg-purple-950/20 rounded-t-xl">
                    ORBIVISION
                  </th>
                  <th className="py-3 px-4">Big Legacy Agencies</th>
                  <th className="py-3 px-4">Freelance Marketplaces</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-medium text-neutral-200">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white bg-purple-950/15 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{row.orbivision}</span>
                    </td>
                    <td className="py-4 px-4 text-neutral-400">
                      {row.traditional}
                    </td>
                    <td className="py-4 px-4 text-neutral-400">
                      {row.freelancers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
}
