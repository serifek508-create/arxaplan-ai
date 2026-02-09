import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Editor from './components/Editor';
import MobilePrototype from './components/MobilePrototype';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-light">
       {/* Background Mesh Gradient - applied globally to layout */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-background-light"
           style={{
             backgroundImage: `
                radial-gradient(at 0% 0%, hsla(188,84%,90%,1) 0, transparent 50%), 
                radial-gradient(at 100% 0%, hsla(180,70%,93%,1) 0, transparent 50%), 
                radial-gradient(at 100% 100%, hsla(188,84%,92%,1) 0, transparent 50%), 
                radial-gradient(at 0% 100%, hsla(180,70%,94%,1) 0, transparent 50%)
             `
           }}
      ></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Hero /></Layout>} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/mobile" element={<MobilePrototype />} />
      </Routes>
    </Router>
  );
};

export default App;
