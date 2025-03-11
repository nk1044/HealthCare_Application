import React from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* PHC Information */}
          <div className="col-span-1 md:col-span-2">
            <div onClick={() => navigate("/")} className="flex items-center cursor-pointer mb-4">
              <img
                src="/iitjlogo1.png"
                className="h-10 mr-3"
                alt="IIT Jodhpur Logo"
              />
              <div>
                <div className="text-lg font-medium text-gray-900">Primary Health Center</div>
                <div className="text-sm text-gray-600">IIT Jodhpur</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Providing healthcare services to students, faculty, and staff of IIT Jodhpur.
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Emergency: 0291 280 1190</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <div 
                  onClick={() => navigate("/")}
                  className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Home
                </div>
              </li>
              <li>
                <div 
                  onClick={() => navigate("/services")}
                  className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Services
                </div>
              </li>
              <li>
                <div 
                  onClick={() => navigate("/about")}
                  className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  About Us
                </div>
              </li>
              <li>
                <div 
                  onClick={() => navigate("/contact")}
                  className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Contact
                </div>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div className="col-span-1">
            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">Additional Resources</h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://iitj.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  IIT Jodhpur Website
                </a>
              </li>
              <li>
                <a 
                  href="https://iitj.ac.in/students/gymkhana/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Student Gymkhana
                </a>
              </li>
              <li>
                <a 
                  href="https://iitj.ac.in/academics/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Academic Calendar
                </a>
              </li>
              <li>
                <div 
                  onClick={() => navigate("/add-to-queue")}
                  className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Book Appointment
                </div>
              </li>
            </ul>
          </div>
        </div>

       

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © {currentYear} Primary Health Center, IIT Jodhpur. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <a 
              href="mailto:phc@iitj.ac.in" 
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              phc@iitj.ac.in
            </a>
            <span className="text-gray-300">|</span>
            <div
              className="text-sm text-gray-600"
            >
              +91 0291 280 1190
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;