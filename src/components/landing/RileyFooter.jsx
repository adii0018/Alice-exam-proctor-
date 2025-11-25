import { Link } from 'react-router-dom';

function RileyFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="ml-3">
                <div className="text-xl font-bold text-white">Alice</div>
                <div className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                  Exam Proctor
                </div>
              </div>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6">
              AI-powered proctoring for secure online examinations.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-gray-300 hover:text-white transition-colors duration-300">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors duration-300">Pricing</Link></li>
              <li><Link to="/demo" className="text-gray-300 hover:text-white transition-colors duration-300">Demo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors duration-300">Help Center</Link></li>
              <li><Link to="/docs" className="text-gray-300 hover:text-white transition-colors duration-300">Documentation</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Alice Exam Proctor. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>All Systems Operational</span>
              </div>
              <div className="text-gray-400">99.9% Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default RileyFooter;