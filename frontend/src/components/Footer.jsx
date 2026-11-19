import React, { useState } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { LinkedinIcon, GithubIcon, TwitterIcon } from './SocialIcons';
import { NAV_LINKS } from '../data/constants';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onOpenAdmin }) {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#060608] border-t border-white/[0.08] pt-16 pb-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          
          {/* Col 1 & 2: Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[1px]">
                <div className="w-full h-full bg-[#0d0d12] rounded-[11px] flex items-center justify-center font-display font-extrabold text-sm text-white">
                  OV
                </div>
              </div>
              <span className="font-display font-black text-2xl tracking-wider text-white">
                ORBI<span className="text-sky-400">VISION</span>
              </span>
            </a>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Premium digital technology and creative solutions agency. We engineer bespoke websites, 
              scalable full-stack applications, and intelligent AI automation architectures.
            </p>

            <div className="pt-2 flex items-center gap-3 text-neutral-400">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center hover:text-white hover:border-purple-500/40 transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center hover:text-white hover:border-purple-500/40 transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center hover:text-white hover:border-purple-500/40 transition-colors"
                title="Twitter / X"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-purple-300 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-mono">
              <li>Web Design & Development</li>
              <li>Full-Stack Web Engineering</li>
              <li>AI Automation & Agents</li>
              <li>iOS & Android App Dev</li>
              <li>UI/UX Design Systems</li>
              <li>Custom Enterprise APIs</li>
              <li>Cloud & DevOps Sprints</li>
            </ul>
          </div>

          {/* Col 5: Direct Founders Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
              Founders Direct
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] space-y-1">
                <span className="font-semibold text-white block">Om Makwana</span>
                <a href="tel:+919426231338" className="text-neutral-400 hover:text-purple-300 block font-mono">
                  +91 9426231338
                </a>
                <a href="mailto:826458om@gmail.com" className="text-neutral-400 hover:text-purple-300 block font-mono truncate">
                  826458om@gmail.com
                </a>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] space-y-1">
                <span className="font-semibold text-white block">Trushal Parmar</span>
                <a href="tel:+918733070464" className="text-neutral-400 hover:text-sky-300 block font-mono">
                  +91 8733070464
                </a>
                <a href="mailto:trushalmparmar96@gmail.com" className="text-neutral-400 hover:text-sky-300 block font-mono truncate">
                  trushalmparmar96@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <span>© {CURRENT_YEAR} ORBIVISION. All rights reserved.</span>
            <span>•</span>
            <span className="text-neutral-400">Operated by Om Makwana &amp; Trushal Parmar</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Terms of Engagement
            </button>
            <button
              onClick={onOpenAdmin}
              className="text-purple-400/80 hover:text-purple-300 transition-colors cursor-pointer"
            >
              Portal
            </button>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Legal Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#0f0f16] border border-white/10 rounded-2xl p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-neutral-900 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {activeModal === 'privacy' && (
              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed font-sans">
                <h3 className="font-display font-bold text-lg text-white mb-2">Privacy &amp; Data Protection</h3>
                <p>ORBIVISION is committed to upholding strict confidentiality standards for every client engagement. Any project details, technical specifications, or proprietary concepts shared through our inquiry forms or consultations are protected under mutual non-disclosure.</p>
                <p>We do not sell, rent, or transfer personal lead information to third parties. Data collected is strictly used to evaluate your engineering requirements and communicate directly with our founders.</p>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed font-sans">
                <h3 className="font-display font-bold text-lg text-white mb-2">Terms of Technical Engagement</h3>
                <p>All agency deliverables, engineering sprints, and custom software architectures are governed by explicit Statements of Work (SOW) executed between ORBIVISION and the client.</p>
                <p>Intellectual property rights for bespoke software, source code, and design assets are fully transferred to the client upon milestone settlement according to contract terms.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
