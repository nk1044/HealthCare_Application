import React from 'react';

function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-lg mt-4">We’re here to help and answer any question you might have.</p>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 px-5 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Get in Touch</h2>
        <p className="text-lg text-center text-gray-600 mb-10">
          Have questions? Fill out the form below and our team will get back to you as soon as possible.
        </p>
        <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Write your message here..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md hover:bg-blue-700"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="py-16 px-5 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Contact Information</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Phone */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">Phone</h4>
              <p className="text-gray-600">+91 9090908080</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">Email</h4>
              <p className="text-gray-600">healthcare@iitj.ac.in</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">Address</h4>
              <p className="text-gray-600">IIT Jodhpur, Rajasthan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
