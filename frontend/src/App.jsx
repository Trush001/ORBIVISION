import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import ProcessSection from './components/ProcessSection';
import WhyChooseUs from './components/WhyChooseUs';
import TechnologiesSection from './components/TechnologiesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import MouseSpotlight from './components/MouseSpotlight';
import { DEFAULT_SERVICES } from './data/constants';

// Lazy-load the heavy administrative dashboard modal
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

export default function App() {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');

  // Hydrate Services from backend API asynchronously if available
  useEffect(() => {
    let isMounted = true;
    fetch('/api/services')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {
        // Gracefully retain static fallback services dataset
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectServiceForInquiry = (serviceTitle) => {
    setPreselectedService(serviceTitle);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-neutral-100 selection:bg-purple-600/30 selection:text-purple-200">
      {/* Subtle Mouse Follower Spotlight */}
      <MouseSpotlight />

      {/* Modern Sticky Navigation */}
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />

      {/* Hero Section with Interactive 3D Canvas */}
      <Hero />

      {/* Services Section */}
      <ServicesSection 
        services={services} 
        onSelectServiceForInquiry={handleSelectServiceForInquiry}
      />

      {/* About Us & Founders Section */}
      <AboutSection />

      {/* Our Process - Development Journey */}
      <ProcessSection />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Supported Technologies Matrix */}
      <TechnologiesSection />

      {/* Project Inquiry Contact Form & Direct Founder Hotlines */}
      <ContactSection 
        preselectedService={preselectedService} 
      />

      {/* Agency Footer */}
      <Footer 
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />

      {/* Admin Dashboard Modal (Lazy Loaded) */}
      {isAdminOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl border-2 border-purple-500 border-t-transparent animate-spin" />
          </div>
        }>
          <AdminDashboard 
            isOpen={isAdminOpen} 
            onClose={() => setIsAdminOpen(false)}
            onRefreshData={fetchData}
          />
        </Suspense>
      )}
    </div>
  );
}
