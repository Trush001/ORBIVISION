import React, { useState } from 'react';
import { 
  Globe, Layers, Monitor, Smartphone, Cpu, Zap, 
  Palette, Sparkles, ShoppingBag, Network, Terminal, Compass,
  ArrowUpRight, Check, X, MessageSquare
} from 'lucide-react';

const ICON_MAP = {
  Globe,
  Layers,
  Monitor,
  Smartphone,
  Cpu,
  Zap,
  Palette,
  Sparkles,
  ShoppingBag,
  Network,
  Terminal,
  Compass,
};

export default function ServicesSection({ services = [], onSelectServiceForInquiry }) {
  const [selectedService, setSelectedService] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = ['All', 'Web & Apps', 'AI & Automation', 'Design & Brand', 'Enterprise & API'];

  const filteredServices = services.filter((s) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Web & Apps') {
      return [
        'Website Design & Development',
        'Full-Stack Web Development',
        'Custom Web Applications',
        'Android & iOS App Development',
        'E-commerce Website Development'
      ].includes(s.title);
    }
    if (activeFilter === 'AI & Automation') {
      return ['AI Automation & AI Integration', 'Business Process Automation'].includes(s.title);
    }
    if (activeFilter === 'Design & Brand') {
      return ['UI/UX Design', 'Graphic Design & Branding'].includes(s.title);
    }
    if (activeFilter === 'Enterprise & API') {
      return ['API Development & Integration', 'Custom Software Solutions', 'Digital Consultation'].includes(s.title);
    }
    return true;
  });

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-[#09090d]/90">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Capabilities & Solutions</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Everything You Need to Build Your <br />
            <span className="text-gradient-purple">Digital Future.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            From modern responsive websites and enterprise SaaS to intelligent AI robotics,
            we engineer robust, end-to-end digital solutions that convert.
          </p>

          <div className="mt-6">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Discuss Your Requirements</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-white/[0.06]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid (12 services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => {
            const IconComponent = ICON_MAP[service.icon_name] || Globe;
            return (
              <div
                key={service.id || idx}
                className="group glass-panel rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/40 hover:-translate-y-1.5"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 group-hover:bg-purple-500/15 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Icon & Order number */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-600 group-hover:text-neutral-400 transition-colors">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white group-hover:text-purple-200 transition-colors">
                    {service.title}
                  </h3>

                  {service.tagline && (
                    <p className="text-xs font-mono text-sky-400/90 mt-1 mb-2">
                      {service.tagline}
                    </p>
                  )}

                  <p className="text-sm text-neutral-400 leading-relaxed mt-2 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Feature chips */}
                  {service.features && service.features.length > 0 && (
                    <div className="mt-5 space-y-1.5 border-t border-white/[0.06] pt-4">
                      {service.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer action - Focused exclusively on inquiries with zero pricing */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => onSelectServiceForInquiry(service.title)}
                    className="text-[11px] font-mono text-sky-400/90 hover:text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Select for Inquiry
                  </button>

                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 group-hover:translate-x-0.5 transition-all cursor-pointer"
                  >
                    <span>Blueprint</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#111118] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/60 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedService(null)}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white bg-neutral-900 border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                {React.createElement(ICON_MAP[selectedService.icon_name] || Globe, { className: "w-7 h-7" })}
              </div>
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                  Solution Blueprint
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <p className="text-base text-neutral-300 leading-relaxed mb-6">
              {selectedService.description}
            </p>

            {/* Features */}
            {selectedService.features && (
              <div className="mb-6">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-3">
                  Technical Specifications & Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/60 border border-white/[0.05] text-xs text-neutral-200">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables */}
            {selectedService.deliverables && (
              <div className="mb-8">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-3">
                  Key Deliverables
                </h4>
                <div className="space-y-2">
                  {selectedService.deliverables.map((deliv, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-purple-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-xs text-neutral-400">
                <span>Every project is customized to your exact technical requirements and timeline.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onSelectServiceForInquiry(selectedService.title);
                    setSelectedService(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-sky-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Discuss Your Requirements</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
