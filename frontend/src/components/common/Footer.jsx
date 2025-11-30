import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: App Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white">
              <BrainCircuit className="text-indigo-500 h-7 w-7" />
              <span>Quizora</span>
            </Link>
            <p className="text-gray-400">
              Transforming documents into interactive learning experiences.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/quiz" className="hover:text-indigo-400 transition-colors">Quiz</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-indigo-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/arin_vk18" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Instagram />
              </a>
              <a 
                href="https://www.linkedin.com/in/arin-pandey-74b872300" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Linkedin />
              </a>
              <a 
                href="https://github.com/ArinPandey" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Github />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>&copy; {currentYear} Quizora. All Rights Reserved. By Arin Pandey</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
