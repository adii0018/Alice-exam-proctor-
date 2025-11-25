import React from 'react';
import ModernHeader from '../components/layout/ModernHeader';
import './FeaturesPage.css';

const FeaturesPage = () => {
  const features = [
    {
      icon: '🔒',
      title: 'Advanced Security',
      description: 'Multi-layer security with AI-powered monitoring and real-time threat detection.',
      details: [
        'End-to-end encryption',
        'Biometric authentication',
        'Secure browser environment',
        'Real-time monitoring'
      ]
    },
    {
      icon: '📹',
      title: 'Video Proctoring',
      description: 'AI-powered video analysis to detect suspicious behavior during exams.',
      details: [
        'Face recognition',
        'Eye tracking',
        'Motion detection',
        'Multiple person detection'
      ]
    },
    {
      icon: '🎤',
      title: 'Audio Monitoring',
      description: 'Advanced audio analysis to detect unauthorized communication.',
      details: [
        'Voice recognition',
        'Background noise detection',
        'Multiple speaker detection',
        'Audio anomaly detection'
      ]
    },
    {
      icon: '🖥️',
      title: 'Screen Monitoring',
      description: 'Complete screen recording and analysis for exam integrity.',
      details: [
        'Screen recording',
        'Tab switching detection',
        'Application monitoring',
        'Copy-paste detection'
      ]
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Comprehensive analytics and reporting for exam administrators.',
      details: [
        'Live monitoring dashboard',
        'Detailed reports',
        'Behavioral analytics',
        'Performance metrics'
      ]
    },
    {
      icon: '⚡',
      title: 'High Performance',
      description: 'Optimized for speed and reliability with minimal system requirements.',
      details: [
        'Low latency streaming',
        'Efficient resource usage',
        'Cross-platform support',
        'Scalable infrastructure'
      ]
    }
  ];

  return (
    <div className="features-page">
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Powerful Features for Secure Examinations</h1>
            <p>
              Comprehensive proctoring solution with cutting-edge technology 
              to ensure exam integrity and provide seamless user experience.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card-detailed">
                <div className="feature-icon-large">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul className="feature-details">
                  {feature.details.map((detail, idx) => (
                    <li key={idx}>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="container">
          <div className="section-header">
            <h2>Built with Modern Technology</h2>
            <p>Our platform leverages the latest technologies to provide reliable and secure exam proctoring.</p>
          </div>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-icon">🤖</div>
              <h4>Artificial Intelligence</h4>
              <p>Advanced AI algorithms for behavior analysis and fraud detection</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">☁️</div>
              <h4>Cloud Infrastructure</h4>
              <p>Scalable cloud-based architecture for global accessibility</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🔐</div>
              <h4>Blockchain Security</h4>
              <p>Immutable record keeping and enhanced security protocols</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">📱</div>
              <h4>Cross-Platform</h4>
              <p>Works seamlessly across all devices and operating systems</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;