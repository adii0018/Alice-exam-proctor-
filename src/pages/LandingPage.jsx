import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StarfieldBackground from '../components/effects/StarfieldBackground';
import './LandingPage.css';

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    // Add dark class to html element for cosmic theme
    document.documentElement.classList.add('dark');
    
    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    window.addEventListener('mousemove', handleMouseMove);
    
    // Loading animation
    setTimeout(() => setIsLoaded(true), 500);
    
    return () => {
      document.documentElement.classList.remove('dark');
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="cosmic-landing bg-gray-900 text-gray-100 min-h-screen overflow-x-hidden">
      {/* Enhanced Double Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-md border-b border-gray-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>System Status: All Systems Operational</span>
                </div>
                <div className="hidden md:flex items-center text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>99.9% Uptime Guaranteed</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/support" className="text-gray-300 hover:text-white transition-colors duration-300">
                  24/7 Support
                </Link>
                <div className="w-px h-4 bg-gray-600"></div>
                <Link to="/docs" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo Section */}
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl">☁</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors duration-300">
                    Ａʟ ɪ c ᴇㅤ☁
                  </div>
                  <div className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                    Exam Proctor AI
                  </div>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                <Link to="/features" className="group relative text-gray-300 hover:text-white font-medium transition-colors duration-300">
                  <span>Features</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
                <Link to="/pricing" className="group relative text-gray-300 hover:text-white font-medium transition-colors duration-300">
                  <span>Pricing</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
                <Link to="/demo" className="group relative text-gray-300 hover:text-white font-medium transition-colors duration-300">
                  <span>Live Demo</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
                <Link to="/about" className="group relative text-gray-300 hover:text-white font-medium transition-colors duration-300">
                  <span>About</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
                <Link to="/contact" className="group relative text-gray-300 hover:text-white font-medium transition-colors duration-300">
                  <span>Contact</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
              </nav>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4">
                <Link 
                  to="/auth" 
                  className="hidden sm:inline-flex items-center px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105"
                >
                  <span>Start Free Trial</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                {/* Mobile Menu Button */}
                <button className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 hidden xl:block">
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-full px-6 py-3 border border-gray-600/30 shadow-2xl">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span>Live: 2,847 Active Exams</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center text-blue-400">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Trusted by 500+ Universities</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center text-purple-400">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>99.9% Detection Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Starfield Background */}
      <StarfieldBackground />
      
      {/* Interactive Cursor Glow */}
      <div 
        className="cursor-glow"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
        }}
      />
      
      {/* Floating Orbs */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
        <div className="orb orb-5"></div>
      </div>

      {/* Floating Clouds */}
      <div className="floating-clouds">
        <div className="cloud cloud-1">☁</div>
        <div className="cloud cloud-2">☁</div>
        <div className="cloud cloud-3">☁</div>
        <div className="cloud cloud-4">☁</div>
        <div className="cloud cloud-5">☁</div>
        <div className="cloud cloud-6">☁</div>
        <div className="cloud cloud-7">☁</div>
        <div className="cloud cloud-8">☁</div>
      </div>

      {/* Hero Section */}
      <section id="hero" className={`relative pt-40 pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center">
          {/* Brand Name */}
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ａʟ ɪ c ᴇㅤ☁
            </h2>
          </div>

          {/* Animated Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-400 px-6 py-2 rounded-full text-sm font-medium mb-8 border border-blue-500/20 backdrop-blur-lg animate-pulse-glow">
            <span className="mr-2 animate-bounce">🚀</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Next-Gen AI Proctoring
            </span>
            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>
          
          {/* Main Title with Typewriter Effect */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            <span className="block">
              <span className="text-blue-400">SECURE</span> <span className="text-purple-400">EXAMS</span>
            </span>
            <span className="block text-3xl md:text-5xl mt-2">
              <span className="text-cyan-400">Powered by</span> <span className="text-pink-400">Ａʟ ɪ c ᴇㅤ☁</span> <span className="text-yellow-400">✨</span>
            </span>
          </h1>
          
          {/* Subtitle with Glow Effect */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            Experience the <span className="text-blue-400 font-semibold glow-text">most advanced</span> AI-powered proctoring system with 
            <span className="text-purple-400 font-semibold glow-text"> real-time monitoring</span> and 
            <span className="text-cyan-400 font-semibold glow-text"> space-grade security</span>
          </p>
          
          {/* CTA Buttons with 3D Effect */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link 
              to="/auth" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="relative z-10">🚀 Start Exam Now</span>
              <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link 
              to="/features" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-100 bg-gray-800/50 backdrop-blur-lg border-2 border-blue-500/30 rounded-2xl hover:border-blue-400/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative z-10">👨‍🏫 Educator Portal</span>
              <svg className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 3D Dashboard Preview */}
        <div className="mt-20 relative perspective-1000">
          {/* Glow Effects */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60 animate-pulse-slow"></div>
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
          
          {/* Main Dashboard */}
          <div className="relative bg-gray-800/60 backdrop-blur-2xl rounded-2xl overflow-hidden border border-gray-600/50 shadow-2xl transform-gpu hover:rotate-y-2 transition-transform duration-700 dashboard-3d">
            {/* Browser Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900/80 border-b border-gray-700/50">
              <div className="flex space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <div className="text-sm text-gray-400 font-mono">alice-exam-proctor.ai</div>
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="relative h-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
              {/* Animated Background Grid */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              
              {/* Central Content */}
              <div className="text-center z-10">
                <div className="text-8xl mb-6 animate-float">🛡️</div>
                <div className="text-2xl font-bold text-white mb-2">AI Proctoring Dashboard</div>
                <div className="text-blue-400 font-medium">Real-time Monitoring Active</div>
                
                {/* Stats Cards */}
                <div className="flex justify-center space-x-4 mt-8">
                  <div className="bg-blue-900/30 backdrop-blur-lg px-4 py-2 rounded-lg border border-blue-500/30">
                    <div className="text-blue-400 text-sm">Active Exams</div>
                    <div className="text-white font-bold text-xl">247</div>
                  </div>
                  <div className="bg-green-900/30 backdrop-blur-lg px-4 py-2 rounded-lg border border-green-500/30">
                    <div className="text-green-400 text-sm">Success Rate</div>
                    <div className="text-white font-bold text-xl">99.8%</div>
                  </div>
                  <div className="bg-purple-900/30 backdrop-blur-lg px-4 py-2 rounded-lg border border-purple-500/30">
                    <div className="text-purple-400 text-sm">AI Accuracy</div>
                    <div className="text-white font-bold text-xl">99.9%</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-6 left-8 w-2 h-2 bg-cyan-500 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative transition-all duration-1000 ${visibleSections.has('pricing') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-cyan-400 bg-cyan-900/20 px-4 py-2 rounded-full border border-cyan-500/30">
              💎 PRICING
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-white">Choose Your</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Flexible pricing for institutions of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-gray-400 mb-6">Perfect for small classes</p>
              <div className="text-4xl font-black text-blue-400 mb-2">$29</div>
              <div className="text-gray-400 text-sm">per month</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Up to 100 students
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Basic AI proctoring
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Email support
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Standard reports
              </li>
            </ul>
            <Link to="/auth" className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300">
              Get Started
            </Link>
          </div>

          {/* Professional Plan - Featured */}
          <div className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-500/50 transform scale-105 shadow-2xl shadow-purple-500/20">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-gray-300 mb-6">For growing institutions</p>
              <div className="text-4xl font-black text-purple-400 mb-2">$99</div>
              <div className="text-gray-400 text-sm">per month</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Up to 1,000 students
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Advanced AI proctoring
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Priority support
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Advanced analytics
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                API access
              </li>
            </ul>
            <Link to="/auth" className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25">
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-cyan-500/50 transition-all duration-500 transform hover:scale-105">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-6">For large organizations</p>
              <div className="text-4xl font-black text-cyan-400 mb-2">Custom</div>
              <div className="text-gray-400 text-sm">contact us</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Unlimited students
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Custom AI models
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                24/7 dedicated support
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                White-label solution
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                On-premise deployment
              </li>
            </ul>
            <Link to="/contact" className="w-full inline-flex items-center justify-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-all duration-300">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative transition-all duration-1000 ${visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent"></div>
        
        <div className="text-center mb-20 relative z-10">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-blue-400 bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30">
              ⚡ POWERED BY AI
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Ａʟ ɪ c ᴇㅤ☁ Grade
            </span>
            <br />
            <span className="text-white">Proctoring Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience the future of online examination with our revolutionary AI-powered system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {/* Feature 1 - Enhanced */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">Real-Time Monitoring</h3>
              <p className="text-gray-300 leading-relaxed">Advanced AI algorithms provide instant detection and flagging of suspicious activities with 99.9% accuracy</p>
              <div className="mt-4 flex items-center text-blue-400 font-semibold">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature 2 - Enhanced */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors duration-300">AI Violation Detection</h3>
              <p className="text-gray-300 leading-relaxed">Machine learning models detect multiple faces, eye movement patterns, and audio anomalies in real-time</p>
              <div className="mt-4 flex items-center text-purple-400 font-semibold">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature 3 - Enhanced */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-cyan-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors duration-300">Secure Environment</h3>
              <p className="text-gray-300 leading-relaxed">Military-grade browser lockdown prevents tab switching and unauthorized resource access</p>
              <div className="mt-4 flex items-center text-cyan-400 font-semibold">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature 4 - Enhanced */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors duration-300">Smart Analytics</h3>
              <p className="text-gray-300 leading-relaxed">Comprehensive reports with AI-powered insights and detailed violation analysis</p>
              <div className="mt-4 flex items-center text-green-400 font-semibold">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature 5 - Enhanced */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-orange-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/25">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-400 transition-colors duration-300">Smart Timer System</h3>
              <p className="text-gray-300 leading-relaxed">Intelligent auto-submit with grace periods and network failure protection</p>
              <div className="mt-4 flex items-center text-orange-400 font-semibold">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature 6 - Enhanced */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-pink-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/25">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-pink-400 transition-colors duration-300">Role-Based Access</h3>
              <p className="text-gray-300 leading-relaxed">Advanced permission system with separate portals for students and educators</p>
              <div className="mt-4 flex items-center text-pink-400 font-semibold">
                <span className="mr-2">Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-400 text-lg font-medium">Trusted by leading educational institutions worldwide</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
          {/* University Logos Placeholder */}
          <div className="flex items-center justify-center h-16 bg-gray-800/30 rounded-lg border border-gray-700/30 backdrop-blur-lg">
            <span className="text-gray-400 font-semibold text-sm">MIT</span>
          </div>
          <div className="flex items-center justify-center h-16 bg-gray-800/30 rounded-lg border border-gray-700/30 backdrop-blur-lg">
            <span className="text-gray-400 font-semibold text-sm">Stanford</span>
          </div>
          <div className="flex items-center justify-center h-16 bg-gray-800/30 rounded-lg border border-gray-700/30 backdrop-blur-lg">
            <span className="text-gray-400 font-semibold text-sm">Harvard</span>
          </div>
          <div className="flex items-center justify-center h-16 bg-gray-800/30 rounded-lg border border-gray-700/30 backdrop-blur-lg">
            <span className="text-gray-400 font-semibold text-sm">Oxford</span>
          </div>
          <div className="flex items-center justify-center h-16 bg-gray-800/30 rounded-lg border border-gray-700/30 backdrop-blur-lg">
            <span className="text-gray-400 font-semibold text-sm">Cambridge</span>
          </div>
          <div className="flex items-center justify-center h-16 bg-gray-800/30 rounded-lg border border-gray-700/30 backdrop-blur-lg">
            <span className="text-gray-400 font-semibold text-sm">Berkeley</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-3xl p-12 border border-gray-600/30 backdrop-blur-xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-300">Join the revolution in online examination</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">50K+</div>
              <div className="text-gray-300 font-medium">Exams Conducted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">99.9%</div>
              <div className="text-gray-300 font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400 mb-2">500+</div>
              <div className="text-gray-300 font-medium">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400 mb-2">24/7</div>
              <div className="text-gray-300 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-purple-400 bg-purple-900/20 px-4 py-2 rounded-full border border-purple-500/30">
              🎥 LIVE DEMO
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-white">See</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Ａʟ ɪ c ᴇㅤ☁ in Action
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Watch how our AI-powered proctoring system works in real-time
          </p>
        </div>

        {/* Video Container */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-60 animate-pulse-slow"></div>
          <div className="relative bg-gray-800/60 backdrop-blur-2xl rounded-2xl overflow-hidden border border-gray-600/50 shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Interactive Demo</h3>
                <p className="text-gray-400 mb-6">Experience the full proctoring workflow</p>
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-green-400 bg-green-900/20 px-4 py-2 rounded-full border border-green-500/30">
              ⭐ TESTIMONIALS
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-white">Loved by</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
              Educators Worldwide
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                Dr
              </div>
              <div className="ml-4">
                <h4 className="text-white font-semibold">Dr. Sarah Johnson</h4>
                <p className="text-gray-400 text-sm">MIT Professor</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed">
              "Ａʟ ɪ c ᴇㅤ☁ has revolutionized our online exams. The AI detection is incredibly accurate and gives us complete confidence in exam integrity."
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                Pr
              </div>
              <div className="ml-4">
                <h4 className="text-white font-semibold">Prof. Michael Chen</h4>
                <p className="text-gray-400 text-sm">Stanford University</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed">
              "The real-time monitoring and detailed analytics have made our assessment process so much more reliable. Highly recommended!"
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                Ms
              </div>
              <div className="ml-4">
                <h4 className="text-white font-semibold">Ms. Emily Rodriguez</h4>
                <p className="text-gray-400 text-sm">Harvard Business School</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed">
              "Setup was incredibly easy and the student experience is seamless. Our exam completion rates have improved significantly."
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-orange-400 bg-orange-900/20 px-4 py-2 rounded-full border border-orange-500/30">
              ❓ FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
              Frequently Asked
            </span>
            <br />
            <span className="text-white">Questions</span>
          </h2>
        </div>

        <div className="space-y-6">
          {/* FAQ Item 1 */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-600/30 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">How accurate is the AI proctoring system?</h3>
              <p className="text-gray-300 leading-relaxed">
                Our AI system achieves 99.9% accuracy in detecting violations through advanced computer vision and machine learning algorithms. It continuously learns and improves from each exam session.
              </p>
            </div>
          </div>

          {/* FAQ Item 2 */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-600/30 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">What devices and browsers are supported?</h3>
              <p className="text-gray-300 leading-relaxed">
                Ａʟ ɪ c ᴇㅤ☁ works on all modern browsers (Chrome, Firefox, Safari, Edge) and supports Windows, Mac, and Linux. Mobile devices are also supported for certain exam types.
              </p>
            </div>
          </div>

          {/* FAQ Item 3 */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-600/30 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Is student privacy protected?</h3>
              <p className="text-gray-300 leading-relaxed">
                Absolutely. We follow strict GDPR and FERPA compliance. All recordings are encrypted, stored securely, and automatically deleted after the retention period set by your institution.
              </p>
            </div>
          </div>

          {/* FAQ Item 4 */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-600/30 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">How easy is it to set up an exam?</h3>
              <p className="text-gray-300 leading-relaxed">
                Creating an exam takes less than 5 minutes. Simply upload your questions, set the duration and rules, and share the exam code with students. Our intuitive interface makes it effortless.
              </p>
            </div>
          </div>

          {/* FAQ Item 5 */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-600/30 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">What happens if there's a technical issue during an exam?</h3>
              <p className="text-gray-300 leading-relaxed">
                Our system includes automatic recovery features, grace periods for network issues, and 24/7 technical support. Students can resume exams seamlessly after resolving technical problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 md:p-12 border border-gray-700/50 backdrop-blur-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to Launch Your Secure Exams?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of educators who trust Ａʟ ɪ c ᴇㅤ☁ Exam Proctor for their online assessments.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                Get Started Free
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </Link>
              <Link 
                to="/features" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-100 bg-gray-800 hover:bg-gray-700 transition-all duration-300"
              >
                Request Demo
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-white mb-2">Ａʟ ɪ c ᴇㅤ☁</h3>
                <p className="text-blue-400 font-medium text-sm uppercase tracking-wider">Exam Proctor</p>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                The future of online examination with AI-powered proctoring, real-time monitoring, and space-grade security for educational institutions worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.180 1.896-.962 6.502-1.359 8.627-.168.9-.499 1.201-.820 1.23-.696.064-1.225-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link to="/features" className="text-gray-300 hover:text-white transition-colors duration-300">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors duration-300">Pricing</Link></li>
                <li><Link to="/demo" className="text-gray-300 hover:text-white transition-colors duration-300">Live Demo</Link></li>
                <li><Link to="/integrations" className="text-gray-300 hover:text-white transition-colors duration-300">Integrations</Link></li>
                <li><Link to="/api" className="text-gray-300 hover:text-white transition-colors duration-300">API Docs</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors duration-300">Careers</Link></li>
                <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors duration-300">Blog</Link></li>
                <li><Link to="/press" className="text-gray-300 hover:text-white transition-colors duration-300">Press Kit</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Ａʟ ɪ c ᴇㅤ☁ Exam Proctor. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">A D I T Y A   </Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">S I N G H </Link>
                <Link to="/security" className="text-gray-400 hover:text-white transition-colors duration-300">R A J P U T</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Shooting Star Effect */}
      <div className="shooting-star"></div>
    </div>
  );
};

export default LandingPage;