import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MonkeyLoginForm from "../components/auth/MonkeyLoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import AnimeBackground from "../components/effects/AnimeBackground";
import ASRLogo from "../components/common/ASRLogo";
import AliceShowcase from "../components/ui/AliceCard";
import "../styles/modern-auth.css";

export default function AuthPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-page-container min-h-screen relative overflow-hidden critical-performance">
      {/* Anime Background with Snowflakes */}
      <AnimeBackground />

      {/* Enhanced Floating Cosmic Orbs - Theme Adaptive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none auth-orbs-container">
        {/* Cyan-Blue Orb */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 rounded-full auth-orb-cyan"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 60, 0],
            y: [0, -60, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Purple-Violet Orb */}
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full auth-orb-purple"
          animate={{
            scale: [1, 1.5, 1],
            x: [0, -60, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pink-Rose Orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full auth-orb-pink"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Emerald Accent Orb */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full auth-orb-emerald"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content - Modern Asymmetrical Layout */}
      <div className="relative z-10 min-h-screen grid lg:grid-cols-12 gap-8 p-4 sm:p-6 md:p-8">
        {/* Left Side - Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:pr-12"
        >
          {/* Modern Hero Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-white/90 mb-2">Welcome to</span>
                <span className="block text-white font-black">
                  Ａʟ ɪ c ᴇㅤ☁
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-xl sm:text-2xl text-white/80 font-medium">
                AI-Powered Online Proctoring System
              </p>
              <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                Experience the future of secure online examinations with our advanced AI monitoring technology.
              </p>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: "🔒", text: "Secure" },
                { icon: "🤖", text: "AI-Powered" },
                { icon: "⚡", text: "Real-time" },
                { icon: "🎯", text: "Accurate" }
              ].map((feature) => (
                <motion.div
                  key={feature.text}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 feature-pill"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-white/90 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Alice Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex justify-center lg:justify-start mt-8"
            >
              <AliceShowcase />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex items-center justify-center lg:justify-end"
        >
          <div className="w-full max-w-md">
            {/* Compact Logo for Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="inline-block mb-4"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 via-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
                  <ASRLogo 
                    className="flex gap-1 justify-center" 
                    size="text-xl"
                    animated={true}
                  />
                </div>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white/90 mb-2">Sign In</h2>
              <p className="text-white/60 text-sm">Access your dashboard</p>
            </motion.div>

            {/* Modern Auth Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="modern-auth-card relative rounded-3xl shadow-2xl p-8 backdrop-blur-2xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Modern Tab Switcher */}
              <div className="flex gap-1 mb-8 p-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab("login")}
                  className={`relative flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === "login" 
                      ? "text-white" 
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  {activeTab === "login" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">Login</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab("register")}
                  className={`relative flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === "register" 
                      ? "text-white" 
                      : "text-white/60 hover:text-white/80"
                  }`}
                >
                  {activeTab === "register" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">Register</span>
                </motion.button>
              </div>

              {/* Forms */}
              <AnimatePresence mode="wait">
                {activeTab === "login" ? (
                  <MonkeyLoginForm key="login" onLogin={onLogin} />
                ) : (
                  <RegisterForm
                    key="register"
                    onSuccess={() => setActiveTab("login")}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-700/50 bg-gradient-to-b from-black via-purple-900/20 to-black overflow-hidden">
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
                <li><a href="/auth" className="text-gray-300 hover:text-white transition-colors duration-300">Get Started</a></li>
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
    </div>
  );
}