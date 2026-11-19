import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { TECHNOLOGIES } from '../data/constants';

export default function TechnologiesSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { key: 'All', label: 'All Technologies' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'database', label: 'Database' },
    { key: 'ai_automation', label: 'AI & Automation' },
    { key: 'other_devops', label: 'Cloud & DevOps' },
  ];

  const allItems = [
    ...TECHNOLOGIES.frontend.map(item => ({ ...item, category: 'Frontend', catKey: 'frontend' })),
    ...TECHNOLOGIES.backend.map(item => ({ ...item, category: 'Backend', catKey: 'backend' })),
    ...TECHNOLOGIES.database.map(item => ({ ...item, category: 'Database', catKey: 'database' })),
    ...TECHNOLOGIES.ai_automation.map(item => ({ ...item, category: 'AI & Automation', catKey: 'ai_automation' })),
    ...TECHNOLOGIES.other_devops.map(item => ({ ...item, category: 'Cloud & DevOps', catKey: 'other_devops' })),
  ];

  const displayedItems = allItems.filter(item => {
    if (activeCategory === 'All') return true;
    return item.catKey === activeCategory;
  });

  return (
    <section id="technologies" className="py-24 relative overflow-hidden bg-[#080808]">
      {/* Background radial lights */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Engineering Arsenal</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Battle-Tested Technologies <br />
            <span className="text-gradient-cyan">Ready for High Scale.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            We only ship with technologies we have verified in production. Modern, maintainable, 
            and battle-tested for enterprise reliability.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 font-semibold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedItems.map((tech, idx) => (
            <div
              key={idx}
              className="group glass-panel rounded-2xl p-5 border border-white/[0.06] hover:border-sky-500/40 hover:bg-[#12121a] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-950/30"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:scale-110 transition-transform">
                    {tech.icon}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    tech.level === 'Expert' 
                      ? 'bg-purple-950/60 border-purple-500/40 text-purple-300' 
                      : 'bg-sky-950/60 border-sky-500/40 text-sky-300'
                  }`}>
                    {tech.level}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white group-hover:text-sky-300 transition-colors">
                  {tech.name}
                </h3>

                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">
                  {tech.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>{tech.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
