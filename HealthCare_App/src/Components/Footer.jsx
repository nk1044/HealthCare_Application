import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 ">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-8 lg:py-12">
        <div className="md:flex md:justify-between">
          {/* Logo and Branding */}
          <div className="mb-6 md:mb-0">
            <a href="https://flowbite.com/" className="flex items-center">
              <img
                src="/iitjlogo1.png"
                className="h-10 mr-3"
                alt="HealthCare Logo"
              />
              <span className="self-center text-2xl font-bold text-gray-900 ">
                HealthCare
              </span>
            </a>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase ">
                Resources
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a href="https://flowbite.com/" className="hover:text-gray-900 transition">
                    HealthCare
                  </a>
                </li>
                <li>
                  <a href="https://tailwindcss.com/" className="hover:text-gray-900  transition">
                    Tailwind CSS
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase ">
                Follow Us
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="https://github.com/themesberg/flowbite"
                    className="hover:text-gray-900  transition"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/4eeurUVvTy" className="hover:text-gray-800 transition">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-700 uppercase ">
                Legal
              </h2>
              <ul className="text-gray-600 ">
                <li className="mb-4">
                  <a href="#" className="hover:text-gray-900  transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-100 " />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-gray-600 ">
            © 2025{' '}
            <a href="https://flowbite.com/" className="hover:underline">
              HealthCare
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:mt-0 space-x-6">
            <a
              href="#"
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
            </a>
            {/* Add other social links with similar icons */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
