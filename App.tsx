import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { ToastProvider } from './lib/useToast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import StatsSection from './components/StatsSection';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Editor from './components/Editor';
import MobilePrototype from './components/MobilePrototype';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import ToolsShowcase from './components/ToolsShowcase';
import TrustedBy from './components/TrustedBy';
import CTA from './components/CTA';
import BatchProcessor from './components/BatchProcessor';

const Layout: React.FC<{ children: React.ReactNode; onAuthOpen: () => void }> = ({ children, onAuthOpen }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-light">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-background-light"
           style={{
             backgroundImage: `
                radial-gradient(at 0% 0%, hsla(188,84%,90%,0.8) 0, transparent 50%), 
                radial-gradient(at 100% 0%, hsla(180,70%,93%,0.6) 0, transparent 50%), 
                radial-gradient(at 50% 50%, hsla(200,60%,95%,0.3) 0, transparent 60%),
                radial-gradient(at 100% 100%, hsla(188,84%,92%,0.7) 0, transparent 50%), 
                radial-gradient(at 0% 100%, hsla(180,70%,94%,0.5) 0, transparent 50%)
             `
           }}
      ></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onAuthOpen={onAuthOpen} />
        {children}
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <Layout onAuthOpen={() => setAuthModalOpen(true)}>
                <Hero />
                <TrustedBy />
                <HowItWorks />
                <ToolsShowcase />
                <StatsSection />
                <Testimonials />
                <Pricing />
                <CTA />
              </Layout>
            } />
            <Route path="/editor" element={<Editor />} />
            <Route path="/batch" element={<BatchProcessor />} />
            <Route path="/mobile" element={<MobilePrototype />} />
          </Routes>
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
          <ToastContainer />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
