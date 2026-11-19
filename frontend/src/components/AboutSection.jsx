import React from 'react';
import { 
  Phone, Mail, MessageSquare, 
  Shield, HeartHandshake, Compass, ArrowUpRight
} from 'lucide-react';
import { FOUNDERS } from '../data/constants';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#09090e]/95">
      {/* Background ambient radial lights */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Leadership & Core DNA</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Two Minds. One Vision. <br />
            <span className="text-gradient-purple">Endless Possibilities.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Founded by Om Makwana and Trushal Parmar, ORBIVISION brings together world-class frontend 
            craftsmanship and deep AI backend engineering to build digital products that move industries forward.
          </p>
        </div>

        {/* Founder Profile Cards (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {FOUNDERS.map((founder) => (
            <div
              key={founder.id}
              className="group glass-panel rounded-3xl p-8 sm:p-10 border border-white/[0.08] hover:border-purple-500/40 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/40 flex flex-col justify-between"
            >
              {/* Corner ambient glow */}
              <div 
                className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: founder.id === 'om' ? '#8B5CF6' : '#38BDF8' }}
              />

              <div>
                {/* Header: Avatar, Name, Role */}
                <div className="flex items-start gap-5 mb-6">
                  {/* Holographic Avatar Badge */}
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${founder.accentColor} p-[2px] shadow-lg`}>
                      <div className="w-full h-full bg-[#0e0e15] rounded-[14px] flex items-center justify-center font-display font-black text-2xl text-white">
                        {founder.initials}
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0a0a0f] border-2 border-emerald-400 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-sky-400 block mb-1">
                      Co-Founder
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                      {founder.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 font-medium mt-0.5">
                      {founder.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  {founder.bio}
                </p>

                {/* Skills Chips */}
                <div className="mb-6">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-2">
                    Core Technical Masteries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {founder.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-neutral-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Contact Actions for Founder */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={`tel:${founder.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    <span className="truncate">{founder.phone}</span>
                  </a>

                  <a
                    href={`mailto:${founder.email}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span className="truncate">{founder.email}</span>
                  </a>
                </div>

                <a
                  href={founder.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Connect with {founder.name.split(' ')[0]} on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Agency Pillars Strip */}
        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2 p-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-white text-base">Client-Centric Agility</h4>
            <p className="text-xs text-neutral-400">Direct communication with decision makers, rapid prototyping, and weekly demonstrable progress.</p>
          </div>

          <div className="space-y-2 p-4 border-y sm:border-y-0 sm:border-x border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 mx-auto flex items-center justify-center text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-white text-base">Engineering Rigor</h4>
            <p className="text-xs text-neutral-400">Zero template cutting. Clean modular codebases, high test coverage, and enterprise security.</p>
          </div>

          <div className="space-y-2 p-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-white text-base">Long-Term Partnerships</h4>
            <p className="text-xs text-neutral-400">We don't disappear after deployment. We support, iterate, and scale alongside your business trajectory.</p>
          </div>
        </div>

        {/* Section Call to Action */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-4 h-4 text-sky-300" />
          </a>
        </div>

      </div>
    </section>
  );
}
