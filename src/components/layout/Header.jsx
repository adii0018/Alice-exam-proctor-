import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo-section">
          <div className="logo-text">
            <span className="brand-name">Ａʟ ɪ c ᴇㅤ☁</span>
            <span className="brand-tagline">Exam Proctor</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-links">
            <Link to="/features" className="nav-link">
              <span>Features</span>
              <div className="nav-underline"></div>
            </Link>
            <Link to="/pricing" className="nav-link">
              <span>Pricing</span>
              <div className="nav-underline"></div>
            </Link>
            <Link to="/about" className="nav-link">
              <span>About</span>
              <div className="nav-underline"></div>
            </Link>
            <Link to="/contact" className="nav-link">
              <span>Contact</span>
              <div className="nav-underline"></div>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="header-cta">
            <Link to="/auth" className="btn-login">
              Sign In
            </Link>
            <Link to="/auth" className="btn-primary">
              Get Started
              <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-links">
            <Link to="/features" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Features
            </Link>
            <Link to="/pricing" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link to="/about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
          </div>
          
          <div className="mobile-cta">
            <Link to="/auth" className="mobile-btn-login" onClick={() => setIsMobileMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/auth" className="mobile-btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;