import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {

  const navigate = useNavigate();


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-lg mt-4">Learn more about our mission, vision, and team.</p>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-5 md:px-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          At <strong>Your Company Name</strong>, our mission is to empower individuals by providing 
          seamless access to reliable healthcare services through technology. 
          We aim to bridge the gap between patients and top-notch medical professionals.
        </p>
      </div>

      {/* Team Section */}
      <div className="py-16 px-5 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Team Member 1 */}
          <div className="w-60 bg-white shadow-lg rounded-lg p-5 text-center">
            <img
              src="/iitjlogo.png"
              alt="Team Member 1"
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            <h3 className="text-lg font-bold mt-4 text-gray-800">John Doe</h3>
            <p className="text-sm text-gray-600">CEO & Founder</p>
          </div>

          {/* Team Member 2 */}
          <div className="w-60 bg-white shadow-lg rounded-lg p-5 text-center">
            <img
              src="/iitjlogo.png"
              alt="Team Member 2"
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            <h3 className="text-lg font-bold mt-4 text-gray-800">Jane Smith</h3>
            <p className="text-sm text-gray-600">CTO</p>
          </div>

          {/* Team Member 3 */}
          <div className="w-60 bg-white shadow-lg rounded-lg p-5 text-center">
            <img
              src="/iitjlogo.png"
              alt="Team Member 3"
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            <h3 className="text-lg font-bold mt-4 text-gray-800">Emily Johnson</h3>
            <p className="text-sm text-gray-600">Lead Developer</p>
          </div>
        </div>
      </div>

      {/* Closing Section */}
      <div className="py-16 px-5 md:px-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Join Us</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          We’re always looking for passionate individuals to join our team and help us create a 
          better healthcare experience. If you share our vision, get in touch with us today!
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md hover:bg-blue-700"
        onClick={() => navigate('/contact')}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}

export default About;
