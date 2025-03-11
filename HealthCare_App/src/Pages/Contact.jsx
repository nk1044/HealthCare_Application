import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: ''
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-medium text-gray-800">Contact Primary Health Center</h1>
          <p className="text-gray-600 mt-1">IIT Jodhpur</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Contact Details Panel */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-lg font-medium text-white">Contact Information</h2>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="px-6 py-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Phone</h3>
                      <p className="mt-1 text-sm text-gray-600">0291 280 1190</p>
                      <p className="mt-1 text-xs text-gray-500">For appointments and general inquiries</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Email</h3>
                      <p className="mt-1 text-sm text-gray-600">phc@iitj.ac.in</p>
                      <p className="mt-1 text-xs text-gray-500">For information and non-urgent matters</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">Location</h3>
                      <p className="mt-1 text-sm text-gray-600">Primary Health Center, Student Activity Center</p>
                      <p className="mt-1 text-sm text-gray-600">IIT Jodhpur, Rajasthan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Operating Hours</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium text-gray-900">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-gray-900">10:00 AM - 2:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Emergency Notice */}
              <div className="bg-red-50 px-6 py-4 border-t border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Emergency Contact</h3>
                    <p className="mt-1 text-sm text-red-700">For medical emergencies: 0291 280 1190</p>
                    <p className="mt-1 text-xs text-red-600">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map or Additional Information */}
            <div className="mt-6 bg-white rounded-md shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Finding Us</h3>
              <div className="w-full h-64 rounded-md overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.496152976635!2d73.11378616505687!3d26.47203348331861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3941aa1c7be30aa9%3A0x39c262aa7c8847c5!2sIIT%20Jodhpur!5e0!3m2!1sen!2sin!4v1615287044191!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="IIT Jodhpur Campus Map"
                ></iframe>
              </div>
              <p className="mt-2 text-xs text-gray-500">The PHC is located in the Student Activity Center.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Send Us a Message</h2>
                <p className="mt-1 text-sm text-gray-600">Please use this form for non-emergency inquiries only.</p>
              </div>

              <div className="px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Appointment Request">Appointment Request</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    ></textarea>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="privacy" className="font-medium text-gray-700">Privacy Agreement</label>
                      <p className="text-gray-500">I understand that my information will be used only for the purpose of addressing my inquiry.</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Submit Message
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-6 bg-white rounded-md shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900">How do I schedule an appointment?</h3>
                  <p className="mt-2 text-sm text-gray-600">You can schedule an appointment by calling our office, using the online appointment system, or visiting the PHC during operating hours.</p>
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900">Do I need to bring my college ID?</h3>
                  <p className="mt-2 text-sm text-gray-600">Yes, please bring your valid college ID card for all visits to the PHC.</p>
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-sm font-medium text-gray-900">Are walk-ins accepted?</h3>
                  <p className="mt-2 text-sm text-gray-600">Walk-ins are accepted for urgent cases, but appointments are recommended for non-urgent consultations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;