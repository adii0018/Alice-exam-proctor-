// Footer Component - website ka bottom section
import { motion } from "framer-motion"; // Smooth animations
import ASRLogo from "./ASRLogo"; // Company logo

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Current year for copyright

  // Footer sections - different categories ke links organize karte hain
  const footerSections = [
    {
      title: "Product", // Product related links
      links: [
        { name: "Features", href: "#features" },
        { name: "Proctoring", href: "#proctoring" },
        { name: "Analytics", href: "#analytics" },
        { name: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Company", // Company related links
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources", // Help aur documentation links
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Help Center", href: "#help" },
        { name: "API Reference", href: "#api" },
        { name: "Community", href: "#community" },
      ],
    },
    {
      title: "Legal", // Legal aur policy links
      links: [
        { name: "Privacy", href: "#privacy" },
        { name: "Terms", href: "#terms" },
        { name: "Cookies", href: "#cookies" },
        { name: "GDPR", href: "#gdpr" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: "💼",
      href: "https://www.linkedin.com/in/aditya-singh-rajput-720aa8326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      color: "hover:bg-blue-500/10 hover:text-blue-500",
    },
    {
      name: "Twitter",
      icon: "🐦",
      href: "#twitter",
      color: "hover:bg-sky-500/10 hover:text-sky-500",
    },
    {
      name: "GitHub",
      icon: "💻",
      href: "#github",
      color: "hover:bg-purple-500/10 hover:text-purple-500",
    },
    {
      name: "YouTube",
      icon: "📺",
      href: "#youtube",
      color: "hover:bg-red-500/10 hover:text-red-500",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-background mt-auto">
      {/* Animated gradient border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section - Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-border/30 flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ASRLogo
                  className="flex gap-0.5"
                  size="text-xl"
                  animated={true}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 blur-xl -z-10"></div>
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-text">Ａʟ ɪ c ᴇㅤ☁</h3>
                <p className="text-xs text-text-secondary">
                  AI-Powered Proctoring
                </p>
              </div>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-md">
              Transform your online assessments with cutting-edge AI technology.
              Secure, fair, and trusted by educators worldwide.~Ａʟ ɪ c ᴇㅤ⸙
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative w-11 h-11 rounded-xl bg-surface/50 backdrop-blur-sm border border-border/50 flex items-center justify-center text-xl transition-all ${social.color}`}
                  aria-label={social.name}
                >
                  <span className="relative z-10">{social.icon}</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all"></div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pl-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-3xl"
              >
                📬
              </motion.span>
              <div>
                <h4 className="text-lg font-bold text-text">
                  Stay in the Loop
                </h4>
                <p className="text-xs text-text-secondary">
                  Get updates & exclusive content
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-5 py-4 pr-36 bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl text-text text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                Subscribe
              </motion.button>
            </div>

            <p className="text-xs text-text-secondary mt-3 flex items-center gap-1.5">
              <span className="text-accent">✓</span>
              No spam, unsubscribe anytime
            </p>
          </motion.div>
        </div>

        {/* Links section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-border/30">
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h5 className="text-text font-bold mb-4 text-sm">
                {section.title}
              </h5>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group text-text-secondary hover:text-primary text-sm transition-colors inline-flex items-center gap-2"
                    >
                      <span className="w-0 h-[2px] bg-primary group-hover:w-4 transition-all duration-300"></span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-text-secondary text-sm">
            <span className="font-medium">© {currentYear} ExamProctor</span>
            <span className="hidden md:block text-border">|</span>
            <span className="text-xs">All rights reserved worldwide</span>
          </div>

          {/* Status & Love */}
          <div className="flex items-center gap-6">
            {/* Status badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent shadow-lg shadow-accent/50"></span>
              </span>
              <span className="text-xs font-semibold text-accent">
                All Systems Operational
              </span>
            </div>

            {/* Made with love */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-text-secondary">
              <span>Made by</span>
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="text-red-500 text-lg"
              >
                ＡDITYA SINGH RAJPUT
              </motion.span>
              <span>for Education</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl -z-10 opacity-30"></div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(var(--color-border-rgb,128,128,128))_1px,transparent_0)] [background-size:24px_24px] opacity-20 -z-10"></div>
    </footer>
  );
}
