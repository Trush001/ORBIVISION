import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Terminal, ChevronRight, MessageSquare } from 'lucide-react';
import { NAV_LINKS } from '../data/constants';

export default function Navbar({ onOpenAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#080808]/85 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/80'
        : 'bg-transparent py-5'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group" aria-label="ORBIVISION Homepage">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-400 p-[1px] shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-all duration-300">
            <div className="w-full h-full bg-[#0d0d12] rounded-[11px] flex items-center justify-center relative overflow-hidden">
              {/* Animated orbital ring */}
              <div className="absolute inset-1 border border-purple-500/40 rounded-full animate-spin [animation-duration:8s]" />
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-400 to-sky-300 shadow-[0_0_12px_#8b5cf6]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-wider text-white group-hover:text-purple-300 transition-colors">
              ORBI<span className="text-sky-400">VISION</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 -mt-1 flex items-center gap-1">
              Creative Tech <span className="inline-block w-1 h-1 rounded-full bg-purple-400"></span> Studio
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/40 border border-white/[0.07] px-4 py-1.5 rounded-full backdrop-blur-md shadow-inner" aria-label="Primary Navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 text-sm font-medium text-neutral-300 hover:text-white rounded-full hover:bg-white/[0.06] transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA / Admin Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Admin link badge */}
          <button
            onClick={onOpenAdmin}
            title="Open Agency Admin Portal"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-neutral-400 hover:text-neutral-200 bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/[0.08] rounded-lg transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </button>

          {/* Let's Talk Button */}
          <a
            href="#contact"
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-full group bg-gradient-to-r from-purple-600 via-indigo-500 to-sky-400 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
          >
            <span className="relative px-5 py-2 transition-all ease-in duration-200 bg-[#0d0d12] rounded-full group-hover:bg-transparent flex items-center gap-2">
              <span className="text-white group-hover:text-white">Let's Talk</span>
              <ArrowUpRight className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            aria-label="Agency Admin"
            className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-white/10 rounded-lg cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-purple-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 text-neutral-300 hover:text-white bg-neutral-900/80 border border-white/10 rounded-xl cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-purple-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f]/98 backdrop-blur-2xl border-b border-white/10 px-5 pt-4 pb-6 transition-all duration-300">
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-medium text-neutral-200 hover:text-purple-400 py-2 border-b border-white/[0.05]"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </a>
            ))}

            <div className="pt-3 flex flex-col gap-2.5">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-gradient-to-r from-purple-600 to-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20"
              >
                Start a Project
              </a>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href="https://wa.me/919426231338?text=Hello%20Om,%20I'd%20like%20to%20consult%20ORBIVISION"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-xs font-mono text-emerald-400"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Om</span>
                </a>
                <a
                  href="https://wa.me/918733070464?text=Hello%20Trushal,%20I'd%20like%20to%20consult%20ORBIVISION"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-xs font-mono text-sky-400"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Trushal</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
