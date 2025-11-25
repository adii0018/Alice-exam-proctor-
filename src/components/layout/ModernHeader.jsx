import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ASRLogo from '../common/ASRLogo';
import './ModernHeader.css';

const ModernHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <div className="logo-icon">
              <ASRLogo 
                className="flex gap-1" 
                size="text-lg"
                animated={true}
              />
            </div>
            <div className="logo-text-container">
              <span className="logo-text">
                <span style={{color: '#60a5fa', display: 'inline'}}>Ａ</span><span style={{color: '#a78bfa', display: 'inline'}}>ʟ</span><span style={{color: '#34d399', display: 'inline'}}> ɪ</span><span style={{color: '#f472b6', display: 'inline'}}> c</span><span style={{color: '#fbbf24', display: 'inline'}}> ᴇ</span><span style={{color: '#06b6d4', display: 'inline'}}> ☁</span>
              </span>
              <span className="logo-subtitle">AI Proctoring</span>
            </div>
          </Link>
        </div>

        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`nav-link ${isActive('/features') ? 'active' : ''}`}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={`nav-link ${isActive('/pricing') ? 'active' : ''}`}
          >
            Pricing
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/auth" className="btn-login">
            Sign In
          </Link>
          <Link to="/auth" className="btn-primary-header">
            Get Started
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </Link>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/features" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Features
          </Link>
          <Link to="/pricing" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </Link>
        </div>
        <div className="mobile-actions">
          <Link to="/auth" className="mobile-btn-login" onClick={() => setIsMobileMenuOpen(false)}>
            Sign In
          </Link>
          <Link to="/auth" className="mobile-btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;