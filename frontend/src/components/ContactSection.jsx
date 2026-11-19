import React, { useState } from 'react';
import { 
  Send, Phone, Mail, MessageSquare, CheckCircle2, 
  AlertCircle, Sparkles, ArrowUpRight, Clock, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactSection({ preselectedService }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceRequired: preselectedService || 'Website Design & Development',
    projectScope: 'Full Custom Build',
    projectDescription: '',
  });

  const [prevSelected, setPrevSelected] = useState(preselectedService);
  if (preselectedService !== prevSelected) {
    setPrevSelected(preselectedService);
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceRequired: preselectedService }));
    }
  }

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const servicesList = [
    "Website Design & Development",
    "Full-Stack Web Development",
    "Custom Web Applications",
    "Android & iOS App Development",
    "AI Automation & AI Integration",
    "Business Process Automation",
    "UI/UX Design",
    "Graphic Design & Branding",
    "E-commerce Website Development",
    "API Development & Integration",
    "Custom Software Solutions",
    "Digital Consultation"
  ];

  const scopeOptions = [
    "MVP / Rapid Launch",
    "Full Custom Build",
    "AI & Automation Integration",
    "Enterprise Scale Architecture",
    "Strategic Consultation"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your contact phone or WhatsApp number.');
      return;
    }
    if (!formData.projectDescription.trim() || formData.projectDescription.length < 10) {
      setErrorMessage('Please briefly describe your project (minimum 10 characters).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || null,
          service_required: formData.serviceRequired,
          project_budget: formData.projectScope, // Map scope to budget field cleanly
          project_description: formData.projectDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit inquiry.');
      }

      setSuccess(true);
      setLoading(false);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#38BDF8', '#ffffff']
      });

    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Something went wrong. Please check your details or connect via WhatsApp.');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#09090e]/95">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Initiate Collaboration</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Have an Idea? <br />
            <span className="text-gradient-purple">Let's Build Something Together.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Tell us about your project vision, timeline, and goals. Om Makwana and Trushal Parmar 
            will personally review your requirements and provide a customized quotation within 2 hours.
          </p>
        </div>

        {/* 2-Column Layout: Form & Direct Founders Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/[0.08] shadow-2xl relative overflow-hidden">
              
              {success ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-white">
                    Project Inquiry Received!
                  </h3>

                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.fullName}</strong>. Om Makwana and Trushal Parmar have received your requirements and will reach out to <strong className="text-sky-300">{formData.email}</strong> with a tailored proposal shortly.
                  </p>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          company: '',
                          serviceRequired: 'Website Design & Development',
                          projectScope: 'Full Custom Build',
                          projectDescription: '',
                        });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white"
                    >
                      Submit Another Inquiry
                    </button>

                    <a
                      href="https://wa.me/919426231338?text=Hello%20Om,%20I%20just%20submitted%20a%20project%20inquiry%20on%20ORBIVISION."
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ping on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                        Full Name <span className="text-purple-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Alex Mercer"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                        Email Address <span className="text-purple-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="alex@enterprise.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                        Phone / WhatsApp <span className="text-purple-400">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                        Company Name <span className="text-neutral-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Acme Innovations"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Dropdown */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      Service Required <span className="text-purple-400">*</span>
                    </label>
                    <select
                      value={formData.serviceRequired}
                      onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#14141c] border border-white/10 focus:border-purple-500 focus:outline-none text-white text-sm transition-colors"
                    >
                      {servicesList.map((service, idx) => (
                        <option key={idx} value={service} className="bg-neutral-900 text-white">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Scope Selector (Replaces pricing completely) */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                      Project Scope & Timeline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {scopeOptions.map((scope) => (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectScope: scope })}
                          className={`py-2 px-3 rounded-lg text-xs font-mono transition-all border ${
                            formData.projectScope === scope
                              ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-semibold'
                              : 'bg-neutral-900/60 border-white/[0.06] text-neutral-400 hover:text-white hover:bg-neutral-800'
                          }`}
                        >
                          {scope}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5">
                      Project Description & Requirements <span className="text-purple-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe your vision, key features, target timeline, or reference requirements..."
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-white/10 focus:border-purple-500 focus:outline-none text-white text-sm placeholder-neutral-500 transition-colors resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending to Om & Trushal...</span>
                      </span>
                    ) : (
                      <>
                        <span>Let's Build Something Together</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-neutral-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Custom Proposal within 2 hours</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Strict NDA & Privacy Respected</span>
                    </span>
                  </div>
                </form>
              )}

            </div>
          </div>

          {/* Right Column: Direct Founder Contacts (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Om Makwana Direct Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/25 relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 block">
                    Direct Contact
                  </span>
                  <h3 className="font-display font-bold text-xl text-white">
                    Om Makwana
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Co-founder | Digital Solutions & Development
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-display font-bold text-sm text-purple-300">
                  OM
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <a
                  href="tel:+919426231338"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/[0.06] text-xs font-mono text-neutral-300 hover:text-white transition-all"
                >
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>+91 9426231338</span>
                </a>

                <a
                  href="mailto:826458om@gmail.com"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/[0.06] text-xs font-mono text-neutral-300 hover:text-white transition-all"
                >
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>826458om@gmail.com</span>
                </a>

                <a
                  href="https://wa.me/919426231338?text=Hello%20Om,%20I'm%20reaching%20out%20from%20ORBIVISION%20website%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-xs font-mono text-emerald-300 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Chat on WhatsApp</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Trushal Parmar Direct Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-sky-500/25 relative overflow-hidden group hover:border-sky-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 block">
                    Direct Contact
                  </span>
                  <h3 className="font-display font-bold text-xl text-white">
                    Trushal Parmar
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Co-founder | AI, Backend & Full-Stack Development
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-display font-bold text-sm text-sky-300">
                  TP
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <a
                  href="tel:+918733070464"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/[0.06] text-xs font-mono text-neutral-300 hover:text-white transition-all"
                >
                  <Phone className="w-4 h-4 text-sky-400" />
                  <span>+91 8733070464</span>
                </a>

                <a
                  href="mailto:trushalmparmar96@gmail.com"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/[0.06] text-xs font-mono text-neutral-300 hover:text-white transition-all"
                >
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>trushalmparmar96@gmail.com</span>
                </a>

                <a
                  href="https://wa.me/918733070464?text=Hello%20Trushal,%20I'm%20reaching%20out%20from%20ORBIVISION%20website%20regarding%20AI%20and%20backend%20solutions."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-xs font-mono text-sky-300 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span>Chat on WhatsApp</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Consultation Guarantee */}
            <div className="p-4 rounded-2xl bg-neutral-900/40 border border-white/[0.06] flex items-center gap-3 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping flex-shrink-0" />
              <span>
                Based in India, operating globally. Remote discovery meetings available across US, UK, and European timezones.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
