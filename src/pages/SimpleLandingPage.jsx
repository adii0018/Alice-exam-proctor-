import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AliceAI from '../components/ai/AliceAI';
import ASRLogo from '../components/common/ASRLogo';

const SimpleLandingPage = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug function to test AI modal
  const handleAIClick = () => {
    console.log('AI button clicked, current state:', isAIOpen);
    setIsAIOpen(true);
    console.log('AI state should now be:', true);
  };

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.dataset.animate]));
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    // Observe all elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Animation classes for different directions
  const getAnimationClass = (direction, isVisible) => {
    const baseClass = "transition-all duration-1000 ease-out";
    
    if (!isVisible) {
      switch (direction) {
        case 'left':
          return `${baseClass} opacity-0 -translate-x-20`;
        case 'right':
          return `${baseClass} opacity-0 translate-x-20`;
        case 'up':
          return `${baseClass} opacity-0 translate-y-20`;
        case 'down':
          return `${baseClass} opacity-0 -translate-y-20`;
        case 'scale':
          return `${baseClass} opacity-0 scale-75`;
        case 'rotate':
          return `${baseClass} opacity-0 rotate-12 scale-90`;
        default:
          return `${baseClass} opacity-0 translate-y-10`;
      }
    }
    
    return `${baseClass} opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
      {/* Mobile-Friendly Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-purple-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* ASR Airplane Logo */}
              <ASRLogo className="flex gap-1 sm:gap-2" size="text-lg sm:text-2xl" animated={true} />
              
              {/* Brand Text */}
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-white">
                  <span className="hidden sm:inline">Ａʟ ɪ c ᴇㅤ☁</span>
                  <span className="sm:hidden">Alice ☁</span>
                </h1>
                <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">Exam Proctor AI</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white font-medium transition-colors">Features</a>
              <a href="#demo" className="text-gray-300 hover:text-white font-medium transition-colors">Demo</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white font-medium transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-300 hover:text-white font-medium transition-colors">Contact</a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleAIClick}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white rounded-lg font-medium transition-all duration-300 border border-purple-600/30 hover:border-purple-500"
                title="Chat with Alice AI"
              >
                <span className="text-lg">🤖</span>
                <span className="text-sm">AI Chat</span>
              </button>
              <Link
                to="/auth"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 lg:px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg text-sm lg:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-purple-800/50 shadow-2xl">
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block py-3 text-gray-300 hover:text-white font-medium transition-colors border-b border-purple-800/30">Features</a>
                <a href="#demo" className="block py-3 text-gray-300 hover:text-white font-medium transition-colors border-b border-purple-800/30">Demo</a>
                <a href="#testimonials" className="block py-3 text-gray-300 hover:text-white font-medium transition-colors border-b border-purple-800/30">Reviews</a>
                <a href="#contact" className="block py-3 text-gray-300 hover:text-white font-medium transition-colors border-b border-purple-800/30">Contact</a>
                
                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleAIClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white rounded-lg font-medium transition-all duration-300 border border-purple-600/30"
                  >
                    <span className="text-lg">🤖</span>
                    <span>AI Chat</span>
                  </button>
                  <Link
                    to="/auth"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 1️⃣ Hero Section */}
      <section className="pt-20 pb-20 bg-gradient-to-b from-black via-purple-900/50 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div 
                data-animate="hero-badge"
                className={`inline-flex items-center px-3 sm:px-4 py-2 bg-black/50 border border-purple-700/50 text-purple-300 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-sm ${getAnimationClass('down', visibleElements.has('hero-badge'))}`}
              >
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                <span className="hidden sm:inline">🚀 AI Agent Jo Tumhare Kaam Half Time Me Kar De</span>
                <span className="sm:hidden">🚀 AI-Powered Solution</span>
              </div>

              {/* Main Headline */}
              <h1 
                data-animate="hero-title"
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight ${getAnimationClass('left', visibleElements.has('hero-title'))}`}
              >
                <span className="text-purple-400">Ａʟ ɪ c ᴇㅤ☁</span>
                <br />
                <span className="text-blue-400">
                  AI Exam Proctor
                </span>
              </h1>

              {/* Sub-headline */}
              <p 
                data-animate="hero-subtitle"
                className={`text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed ${getAnimationClass('right', visibleElements.has('hero-subtitle'))}`}
              >
                <span className="font-semibold text-purple-300">Fast, Secure & Easy</span> — Without Any Technical Setup
                <br className="hidden sm:block" />
                <span className="block sm:inline">Revolutionary AI proctoring in minutes, not hours.</span>
              </p>

              {/* CTA Buttons */}
              <div 
                data-animate="hero-buttons"
                className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 ${getAnimationClass('up', visibleElements.has('hero-buttons'))}`}
              >
                <Link
                  to="/auth"
                  className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 text-center text-sm sm:text-base"
                >
                  👉 Get Started Free
                </Link>
                <button className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-black/50 hover:bg-purple-900/50 text-white font-bold rounded-xl border border-purple-600/50 hover:border-purple-500 transition-all duration-300 shadow-xl backdrop-blur-sm text-sm sm:text-base">
                  👉 Watch Demo
                </button>
              </div>

              {/* AI Assistant CTA */}
              <div className="mb-8 sm:mb-12 text-center lg:text-left">
                <button
                  onClick={handleAIClick}
                  className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 group text-sm sm:text-base"
                >
                  <span className="text-xl sm:text-2xl animate-bounce group-hover:animate-pulse">🤖</span>
                  <span>Try Alice AI</span>
                  <span className="hidden sm:inline text-sm opacity-90">- Ask Anything!</span>
                </button>
                <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 text-xs sm:text-sm text-gray-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="hidden sm:inline">AI Assistant Online • Available 24/7</span>
                  <span className="sm:hidden">AI Online 24/7</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-300">10,000+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span className="text-gray-300 hidden sm:inline">500+ Universities</span>
                  <span className="text-gray-300 sm:hidden">500+ Unis</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Mockup */}
            <div 
              data-animate="hero-mockup"
              className={`relative mt-8 lg:mt-0 ${getAnimationClass('scale', visibleElements.has('hero-mockup'))}`}
            >
              <div className="bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-sm rounded-2xl lg:rounded-3xl border border-purple-700/30 p-4 sm:p-6 lg:p-8 shadow-2xl">
                <div className="bg-black/50 rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-purple-600/30">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 bg-gray-800 rounded px-2 sm:px-3 py-1 text-xs text-gray-400">alice-proctor.com</div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-3/4"></div>
                    <div className="h-2 sm:h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-2 sm:h-3 bg-gray-700 rounded w-2/3"></div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <div className="h-12 sm:h-16 lg:h-20 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded border border-purple-500/30"></div>
                      <div className="h-12 sm:h-16 lg:h-20 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded border border-blue-500/30"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-4 sm:w-6 h-4 sm:h-6 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Core Value Proposition */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-900/30 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate="value-header"
            className={`text-center mb-16 ${getAnimationClass('down', visibleElements.has('value-header'))}`}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why Alice is the
              <span className="text-purple-400"> Best Choice</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tumhara exam security problem solve karne ka sabse easy aur effective way
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "⚡",
                title: "Super Fast",
                description: "Setup in under 5 minutes. No technical knowledge required.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: "🔒",
                title: "Secure",
                description: "Military-grade security with 99.9% detection accuracy.",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: "🎯",
                title: "Highly Accurate",
                description: "AI-powered detection with zero false positives.",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                icon: "💡",
                title: "Easy UI",
                description: "Intuitive interface that anyone can use instantly.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((value, index) => (
              <div 
                key={index} 
                data-animate={`value-${index}`}
                className={`text-center p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-700/40 hover:border-purple-500/60 transition-all duration-300 hover:bg-purple-900/30 group ${getAnimationClass(
                  index % 2 === 0 ? 'left' : 'right', 
                  visibleElements.has(`value-${index}`)
                )}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ Key Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-black via-purple-900/30 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate="features-header"
            className={`text-center mb-20 ${getAnimationClass('up', visibleElements.has('features-header'))}`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-black/50 border border-purple-600/50 text-purple-300 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Complete Exam Security
              <br />
              <span className="text-blue-400">
                Solution
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "👁️",
                title: "Face Detection",
                description: "Advanced facial recognition with real-time monitoring and identity verification.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "🚨",
                title: "Real-time Alerts",
                description: "Instant notifications for suspicious activities and policy violations.",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: "📊",
                title: "Dashboard",
                description: "Comprehensive analytics dashboard with detailed reports and insights.",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: "👥",
                title: "Unlimited Users",
                description: "No limits on students, exams, or concurrent sessions. Scale freely.",
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                icon: "☁️",
                title: "Cloud Backup",
                description: "Automatic cloud storage with 99.9% uptime and data security.",
                gradient: "from-orange-500 to-yellow-500"
              },
              {
                icon: "🤖",
                title: "AI Assistant",
                description: "Built-in AI helper for students and educators with instant support.",
                gradient: "from-pink-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                data-animate={`feature-${index}`}
                className={`group p-8 bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-700/40 hover:border-purple-500/60 transition-all duration-300 hover:bg-purple-900/30 hover:transform hover:scale-105 ${getAnimationClass(
                  ['up', 'left', 'right', 'rotate', 'scale', 'down'][index % 6],
                  visibleElements.has(`feature-${index}`)
                )}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4️⃣ Social Proof Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-black via-purple-900/40 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-black/50 border border-purple-600/50 text-purple-300 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
              Social Proof
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Trusted by Thousands
              <br />
              <span className="text-purple-400">
                Worldwide
              </span>
            </h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "10,000+", label: "Active Users", icon: "👥" },
              { number: "99.9%", label: "Uptime", icon: "⚡" },
              { number: "500+", label: "Universities", icon: "🏛️" },
              { number: "50K+", label: "Exams Secured", icon: "🛡️" }
            ].map((stat, index) => (
              <div 
                key={index} 
                data-animate={`stat-${index}`}
                className={`text-center p-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-700/30 ${getAnimationClass(
                  'scale',
                  visibleElements.has(`stat-${index}`)
                )}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-black text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                rating: 5,
                text: "Alice ne hamara exam process completely transform kar diya. Setup sirf 5 minutes me ho gaya!",
                name: "Dr. Priya Sharma",
                title: "IIT Delhi Professor",
                avatar: "👩‍🏫"
              },
              {
                rating: 5,
                text: "Best AI proctoring solution! Students ko bhi easy laga aur teachers ko bhi. Highly recommended.",
                name: "Rahul Kumar",
                title: "Education Director",
                avatar: "👨‍💼"
              },
              {
                rating: 5,
                text: "99.9% accuracy with zero false alerts. Alice is a game-changer for online education.",
                name: "Prof. Sarah Johnson",
                title: "MIT Professor",
                avatar: "👩‍🔬"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                data-animate={`testimonial-${index}`}
                className={`p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-700/40 hover:border-purple-500/60 transition-all duration-300 ${getAnimationClass(
                  ['left', 'up', 'right'][index % 3],
                  visibleElements.has(`testimonial-${index}`)
                )}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-purple-300 text-sm">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Demo/Screenshots Section */}
      <section id="demo" className="py-24 bg-gradient-to-b from-black via-purple-900/30 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              See Alice in
              <span className="text-blue-400"> Action</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real screenshots and demo of our AI proctoring system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Demo Video Placeholder */}
            <div className="relative">
              <div className="bg-black/50 backdrop-blur-sm rounded-3xl border border-purple-700/40 p-8 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-black/50 rounded-2xl border border-purple-600/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <button className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
                    <span className="text-3xl ml-1 group-hover:scale-110 transition-transform">▶️</span>
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Live Demo Video</h3>
                  <p className="text-gray-300">Watch how Alice works in real-time</p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {[
                {
                  icon: "🎥",
                  title: "Real-time Monitoring",
                  description: "Live video feed with AI analysis"
                },
                {
                  icon: "🔍",
                  title: "Behavior Detection",
                  description: "Instant alerts for suspicious activities"
                },
                {
                  icon: "📱",
                  title: "Mobile Support",
                  description: "Works on all devices and platforms"
                },
                {
                  icon: "⚡",
                  title: "Instant Setup",
                  description: "Get started in under 5 minutes"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6️⃣ Use Cases Section */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/40 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Perfect for
              <span className="text-green-400"> Everyone</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Alice works for all types of educational institutions and use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎓",
                title: "Students",
                description: "Take secure exams from anywhere with confidence and ease.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "👨‍💻",
                title: "Developers",
                description: "Easy API integration with comprehensive documentation.",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: "🏢",
                title: "Businesses",
                description: "Corporate training and certification programs made secure.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: "🎯",
                title: "Agencies",
                description: "White-label solutions for educational service providers.",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((useCase, index) => (
              <div key={index} className="text-center p-8 bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-700/40 hover:border-purple-500/60 transition-all duration-300 hover:bg-purple-900/30 group">
                <div className={`w-16 h-16 bg-gradient-to-r ${useCase.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{useCase.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{useCase.title}</h3>
                <p className="text-gray-300 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7️⃣ Comparison Section */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/30 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why Choose
              <span className="text-yellow-400"> Alice?</span>
            </h2>
            <p className="text-xl text-gray-300">
              See how we compare with other solutions
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-purple-700/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-700/40">
                    <th className="text-left p-6 text-white font-bold">Feature</th>
                    <th className="text-center p-6 text-gray-400 font-bold">Others</th>
                    <th className="text-center p-6 text-purple-300 font-bold">Alice AI</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Setup Time", others: "Hours/Days", alice: "5 Minutes ⚡" },
                    { feature: "Technical Knowledge", others: "Required", alice: "Zero Required 💡" },
                    { feature: "Detection Accuracy", others: "85-90%", alice: "99.9% 🎯" },
                    { feature: "False Positives", others: "High", alice: "Zero 🔒" },
                    { feature: "Support", others: "Email Only", alice: "24/7 Live Chat 💬" },
                    { feature: "Pricing", others: "Complex", alice: "Simple & Fair 💰" }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-purple-700/20 hover:bg-purple-900/20 transition-colors">
                      <td className="p-6 text-white font-medium">{row.feature}</td>
                      <td className="p-6 text-center text-gray-400">{row.others}</td>
                      <td className="p-6 text-center text-green-400 font-semibold">{row.alice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 8️⃣ Trust & Credibility */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/40 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Trusted &
              <span className="text-green-400"> Certified</span>
            </h2>
          </div>

          {/* Partners & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-700/30">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-2">ISO Certified</h3>
              <p className="text-gray-300">International security standards compliance</p>
            </div>
            <div className="text-center p-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-700/30">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">GDPR Compliant</h3>
              <p className="text-gray-300">Full data protection and privacy compliance</p>
            </div>
            <div className="text-center p-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-700/30">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">99.9% Uptime</h3>
              <p className="text-gray-300">Reliable service with guaranteed availability</p>
            </div>
          </div>

          {/* University Logos */}
          <div className="text-center">
            <p className="text-gray-400 font-semibold mb-8">Trusted by leading institutions worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['MIT', 'Stanford', 'Harvard', 'Oxford', 'Cambridge', 'IIT Delhi'].map((uni, index) => (
                <div key={index} className="px-6 py-3 bg-black/50 rounded-xl border border-purple-600/40 font-bold text-purple-200 backdrop-blur-sm">
                  {uni}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9️⃣ Final CTA Section */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/40 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="relative z-30 inline-flex items-center px-4 py-2 bg-purple-900/50 backdrop-blur-sm border border-purple-400/50 text-purple-200 rounded-full text-sm font-medium mb-8 shadow-lg">
            <span className="w-2 h-2 bg-purple-300 rounded-full mr-2 animate-pulse"></span>
            🚀 Ready to Transform Your Exams?
          </div>

          <h2 className="relative z-30 text-4xl md:text-6xl font-black text-white mb-8 drop-shadow-lg">
            Start Your Journey
            <br />
            <span className="text-yellow-400">
              Today
            </span>
          </h2>
          
          <p className="relative z-30 text-xl text-purple-100 mb-12 max-w-3xl mx-auto drop-shadow-md">
            Join 10,000+ educators who trust Alice for secure online assessments. 
            <br />
            <span className="font-semibold">Setup takes less than 5 minutes!</span>
          </p>

          <div className="relative z-30 flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              to="/auth"
              className="px-12 py-5 bg-white text-black font-black text-lg rounded-xl hover:bg-purple-100 transition-all duration-300 shadow-2xl transform hover:scale-105 relative z-40"
            >
              🚀 Launch Your App Today
            </Link>
            <button 
              onClick={handleAIClick}
              className="px-12 py-5 border-2 border-purple-400 text-purple-200 font-black text-lg rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-xl relative z-40"
            >
              💬 Try Alice AI Now
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-purple-200">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/News Section */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/30 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-blue-500/12 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-black/50 border border-purple-600/50 text-purple-300 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
              Latest Updates
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Latest Blogs &
              <span className="text-purple-400"> News</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest in AI proctoring technology and educational insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "How AI is Revolutionizing Online Education Security",
                excerpt: "Discover how artificial intelligence is transforming the way we conduct secure online examinations...",
                date: "Dec 15, 2025",
                readTime: "5 min read",
                category: "Technology",
                image: "🤖"
              },
              {
                title: "Best Practices for Remote Exam Proctoring",
                excerpt: "Learn the essential guidelines and strategies for implementing effective remote proctoring...",
                date: "Dec 12, 2025",
                readTime: "7 min read",
                category: "Education",
                image: "📚"
              },
              {
                title: "Alice AI Update: New Features & Improvements",
                excerpt: "Exciting new features including enhanced detection algorithms and improved user interface...",
                date: "Dec 10, 2025",
                readTime: "3 min read",
                category: "Product",
                image: "🚀"
              }
            ].map((blog, index) => (
              <article key={index} className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-700/40 hover:border-purple-500/60 transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                      {blog.image}
                    </div>
                    <div>
                      <span className="text-xs text-purple-300 font-semibold">{blog.category}</span>
                      <div className="text-xs text-gray-400">{blog.date} • {blog.readTime}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {blog.excerpt}
                  </p>
                  <button className="text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Support Form Section */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/40 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/6 w-80 h-80 bg-purple-500/18 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/6 w-64 h-64 bg-blue-500/12 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-black/50 border border-purple-600/50 text-purple-300 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                Need Help?
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Need Any
                <span className="text-purple-400"> Help?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Have questions about Alice AI? Our team is here to help you get started 
                and make the most of our AI proctoring solution.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Email Support</div>
                    <a href="mailto:opg21139@gmail.com" className="text-purple-300 hover:text-purple-200 transition-colors">opg21139@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Live Chat</div>
                    <div className="text-gray-300">Available 24/7</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Phone Support</div>
                    <a href="tel:+918329740106" className="text-purple-300 hover:text-purple-200 transition-colors">+91 8329740106</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Contact Form */}
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-purple-700/40 p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Subject</label>
                  <select className="w-full px-4 py-3 bg-black/50 border border-purple-600/50 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Sales Question</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Message</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 bg-black/50 border border-purple-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  Send Message
                </button>
                <p className="text-xs text-gray-400 text-center">
                  🔒 We respect your privacy. Your information is secure and will never be shared.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Wall of Love - Enhanced Testimonials */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/30 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-pink-500/12 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-black/50 border border-purple-600/50 text-purple-300 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
              Wall of Love
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              What Our Users
              <span className="text-purple-400"> Say</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real feedback from educators and institutions using Alice AI
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Dr. Sarah Johnson",
                title: "MIT Professor",
                avatar: "👩‍🏫",
                text: "Alice has completely transformed our online assessment process. The setup was incredibly easy!",
                rating: 5
              },
              {
                name: "Prof. Michael Chen",
                title: "Stanford University",
                avatar: "👨‍🏫",
                text: "99.9% accuracy with zero false positives. This is exactly what we needed for our medical exams.",
                rating: 5
              },
              {
                name: "Dr. Emily Rodriguez",
                title: "Harvard Medical School",
                avatar: "👩‍⚕️",
                text: "The AI assistant feature is brilliant. Students love how easy it is to get help during exams.",
                rating: 5
              },
              {
                name: "Prof. David Kim",
                title: "Oxford University",
                avatar: "👨‍💼",
                text: "Best investment we've made for our online education program. Highly recommended!",
                rating: 5
              },
              {
                name: "Dr. Lisa Wang",
                title: "IIT Delhi",
                avatar: "👩‍💻",
                text: "The real-time monitoring is incredible. We can see everything happening during the exam.",
                rating: 5
              },
              {
                name: "Prof. James Wilson",
                title: "Cambridge University",
                avatar: "👨‍🔬",
                text: "Alice made remote proctoring so simple. Our students adapted to it immediately.",
                rating: 5
              },
              {
                name: "Dr. Maria Garcia",
                title: "Barcelona University",
                avatar: "👩‍🎓",
                text: "The customer support is outstanding. They helped us set up everything in just one call.",
                rating: 5
              },
              {
                name: "Prof. Robert Taylor",
                title: "Yale University",
                avatar: "👨‍🏫",
                text: "Finally, a proctoring solution that actually works as advertised. Amazing technology!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-700/40 hover:border-purple-500/60 transition-all duration-300 p-6 group">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">⭐</span>
                  ))}
                </div>
                
                <p className="text-gray-200 text-sm mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-purple-300 text-xs">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/40 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/4 w-88 h-88 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/12 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Success
              <span className="text-green-400"> Stories</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real case studies from institutions that transformed their exam security with Alice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                institution: "MIT Computer Science Department",
                challenge: "Needed to conduct 500+ online exams during pandemic with zero cheating incidents",
                solution: "Implemented Alice AI with real-time monitoring and behavior detection",
                results: [
                  "100% exam integrity maintained",
                  "95% student satisfaction rate",
                  "50% reduction in exam administration time"
                ],
                logo: "🏛️"
              },
              {
                institution: "Stanford Medical School",
                challenge: "Required HIPAA-compliant proctoring for medical certification exams",
                solution: "Used Alice's secure environment with encrypted data handling",
                results: [
                  "Full HIPAA compliance achieved",
                  "99.9% detection accuracy",
                  "Zero false positive incidents"
                ],
                logo: "🏥"
              }
            ].map((study, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm rounded-3xl border border-purple-700/40 p-8 hover:border-purple-500/60 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl">
                    {study.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{study.institution}</h3>
                    <div className="text-purple-300 text-sm">Case Study</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">Challenge:</h4>
                    <p className="text-gray-300 text-sm">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">Solution:</h4>
                    <p className="text-gray-300 text-sm">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-300 mb-2">Results:</h4>
                    <ul className="space-y-1">
                      {study.results.map((result, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-black via-purple-900/30 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-black/50 border border-purple-600/50 text-purple-300 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
              Questions About Alice AI?
            </div>
            <h2 className="text-4xl font-black text-white mb-6">
              Frequently Asked
              <span className="text-blue-400"> Questions</span>
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about Alice AI proctoring
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly can I set up Alice?",
                answer: "Alice can be set up in under 5 minutes. No technical knowledge required - just sign up, configure your exam settings, and you're ready to go! Our onboarding process is designed to be as simple as possible."
              },
              {
                question: "Is Alice compatible with my existing LMS?",
                answer: "Yes! Alice integrates seamlessly with all major LMS platforms including Moodle, Canvas, Blackboard, Google Classroom, and more through our simple API. We also provide detailed integration guides and support."
              },
              {
                question: "What happens if there's a false positive?",
                answer: "Alice's AI is 99.9% accurate with virtually zero false positives. In the rare case of a dispute, our detailed logs and video evidence help resolve issues quickly. We also have a human review process for any flagged incidents."
              },
              {
                question: "Do students need to install anything?",
                answer: "No downloads required! Alice works directly in the browser on any device - desktop, laptop, tablet, or smartphone. Students just need a webcam and microphone, which most devices have built-in."
              },
              {
                question: "Is Alice GDPR and FERPA compliant?",
                answer: "Absolutely! Alice is fully compliant with GDPR, FERPA, and other international privacy regulations. All data is encrypted end-to-end and stored securely with regular security audits."
              },
              {
                question: "What kind of support do you provide?",
                answer: "We offer 24/7 live chat support, email support, phone support, and comprehensive documentation. Our team is always ready to help you get the most out of Alice AI."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-black/50 backdrop-blur-sm rounded-2xl border border-purple-700/40 p-6 hover:border-purple-500/60 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <button 
              onClick={handleAIClick}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
            >
              Ask Alice AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-700/50 bg-gradient-to-b from-black via-purple-900/20 to-black overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-blue-500/8 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                {/* ASR Airplane Logo */}
                <div className="mr-4">
                  <ASRLogo className="flex gap-2" size="text-2xl" animated={true} />
                </div>
                
                {/* Brand Text */}
                <div>
                  <h3 className="text-2xl font-black text-white mb-1">Ａʟ ɪ c ᴇㅤ☁</h3>
                  <p className="text-blue-400 font-medium text-sm uppercase tracking-wider">Exam Proctor</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                The future of online examination with AI-powered proctoring, real-time monitoring, and space-grade security for educational institutions worldwide.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <a href="https://www.snapchat.com/add/bornx2xkill?share_id=udSICNdWm0U&locale=en-IN" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors duration-300 mx-auto mb-2" title="Add on Snapchat">
                    <span className="text-lg">👻</span>
                  </a>
                  <span className="text-xs text-gray-400 font-medium">Snapchat</span>
                </div>
                <div className="text-center">
                  <a href="https://www.linkedin.com/in/aditya-singh-rajput-720aa8326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300 mx-auto mb-2" title="Connect on LinkedIn">
                    <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <span className="text-xs text-gray-400 font-medium">LinkedIn</span>
                </div>
                <div className="text-center">
                  <a href="https://www.instagram.com/http._.adiix?igsh=MXVscHpwMWtxZGZpNg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors duration-300 mx-auto mb-2" title="Follow on Instagram">
                    <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <span className="text-xs text-gray-400 font-medium">Instagram</span>
                </div>
                <div className="text-center">
                  <a href="https://github.com/adii0018" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-300 mx-auto mb-2" title="View on GitHub">
                    <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <span className="text-xs text-gray-400 font-medium">GitHub</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300">Features</a></li>
                <li><a href="#demo" className="text-gray-300 hover:text-white transition-colors duration-300">Live Demo</a></li>
                <li><Link to="/auth" className="text-gray-300 hover:text-white transition-colors duration-300">Get Started</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Integrations</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">API Docs</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Help Center</a></li>
                <li><a href="mailto:opg21139@gmail.com" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
                <li><a href="tel:+918329740106" className="text-gray-300 hover:text-white transition-colors duration-300">Phone Support</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Ａʟ ɪ c ᴇㅤ☁ Exam Proctor. All rights reserved. | Developed by <span className="text-blue-400 font-medium">Aditya Singh Rajput</span>
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant Modal */}
      <AliceAI isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default SimpleLandingPage;