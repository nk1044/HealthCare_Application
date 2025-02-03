import React from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {

  const navigate = useNavigate();


  return (
    <footer className="bg-gray-100 ">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-8 lg:py-12">
        <div className="md:flex md:justify-between">
          {/* Logo and Branding */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
            >
              <img
                src="/iitjlogo1.png"
                className="h-10 mr-3"
                alt="HealthCare Logo"
              />
              <span className="self-center text-2xl font-bold text-gray-900 ">
                HealthCare
              </span>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase cursor-pointer"
              onClick={() => navigate("/")}>
                Resources
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <div className="hover:text-gray-900 transition cursor-pointer"
                  onClick={() => navigate("/")}>
                    HealthCare
                  </div>
                </li>
                <li>
                  <div className="hover:text-gray-900  transition cursor-pointer"
                  onClick={() => navigate("/")}
                  >
                    IITJ
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase cursor-pointer"
              onClick={() => navigate("/")}
              >
                Follow Us
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <div
                    className="hover:text-gray-900 cursor-pointer transition"
                    onClick={() => navigate("/")}
                  >
                    GitHub
                  </div>
                </li>
                <li>
                  <div className="hover:text-gray-800 transition cursor-pointer"
                  onClick={() => navigate("/")}
                  >
                    Discord
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase cursor-pointer"
              onClick={() => navigate("/")}
              >
                Legal
              </h2>
              <ul className="text-gray-600 ">
                <li className="mb-4">
                  <div className="hover:text-gray-900 cursor-pointer transition"
                  onClick={() => navigate("/")}
                  >
                    Privacy Policy
                  </div>
                </li>
                <li>
                  <div className="hover:text-gray-900 transition cursor-pointer"
                  onClick={() => navigate("/")}
                  >
                    Terms & Conditions
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-100 " />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-gray-600 flex">
            © 2025{' '}
            <div className="hover:underline">
              HealthCare
            </div>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:mt-0 space-x-6">
            <div
              className="text-gray-800 hover:text-gray-900 "
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.89v-2.89h2.55V9.8c0-2.52 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.44h-1.25c-1.23 0-1.61.76-1.61 1.54v1.85h2.73l-.44 2.89h-2.29v6.99C18.34 21.12 22 16.99 22 12z" />
              </svg>
            </div>
            {/* Add other social links with similar icons */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
