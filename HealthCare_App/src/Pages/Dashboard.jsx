import React, { useEffect, useState } from 'react';
import MedCard from '../Components/MedCard';
import SecondCard from '../Components/SecondCard';
import ThirdCard from '../Components/ThirdCard';
import { GetHomePageData } from '../Server/Server';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [secondCardsData, setSecondCardsData] = useState([]);
  const [thirdCardsData, setThirdCardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getPageData = async () => {
    setIsLoading(true);
    try {
      const data = await GetHomePageData();
      setSecondCardsData(data?.specialists);
      setThirdCardsData(data?.partner_clinics);
    } catch (err) {
      console.log('GetHomePageData failed', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPageData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Welcome to IITJ Healthcare Center</h1>
              <p className="text-gray-700 text-lg mb-6">Your trusted partner for comprehensive healthcare services on iitj campus.</p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => navigate('/add-to-queue')}
              >
                Book Appointment
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://img.freepik.com/free-vector/flat-hand-drawn-patient-taking-medical-examination_52683-57829.jpg"
                alt="Healthcare illustration"
                className="max-w-full h-auto rounded-lg shadow-md"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Featured Services */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Our Featured Services</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our top services for your health needs with personalized care and attention.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">

              <div className="transition-all cursor-pointer duration-200 hover:shadow-lg"
                onClick={() => navigate('/add-to-queue')}>
                <MedCard
                  title={"Online Consultation"}
                  description={"Skip the travel! Take Online Doctor Consultation"}
                  image_url={"https://png.pngtree.com/png-vector/20240124/ourmid/pngtree-doctor-consult-patient-online-on-mobile-phone-png-image_11486770.png"} />
              </div>
              <div className="transition-all cursor-pointer duration-200 hover:shadow-lg"
                onClick={() => navigate('/services')}>
                <MedCard
                  title={"Book Appointment"}
                  description={"Book doctor appointment online with top specialists"}
                  image_url={"https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-medical-check-up_516790-2335.jpg"} />
              </div>
              <div className="transition-all cursor-pointer duration-200 hover:shadow-lg"
                onClick={() => navigate('/services')}>
                <MedCard
                  title={"Pharmacy & Medicine Delivery"}
                  description={"Order your medicines online and get them delivered to your doorstep"}
                  image_url={"https://cdni.iconscout.com/illustration/premium/thumb/online-pharmacy-illustration-download-in-svg-png-gif-file-formats--store-medicine-internet-of-things-pack-network-communication-illustrations-4849712.png?f=webp"} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Specialists */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Meet Our Specialists</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Highly qualified specialists with years of experience ready to help you with your healthcare needs.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {secondCardsData?.map((card, index) => (
                <div key={index} className="transition-all duration-200 hover:shadow-lg">
                  <SecondCard {...card} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Booking Info */}
      <section className="py-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Book an Appointment for an In-Clinic Consultation</h2>
          <p className="text-lg mb-6 opacity-90">Find a clinic on campus for personalized care and attention from our medical professionals.</p>

          <button
            className="px-6 py-3 bg-white text-blue-700 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            onClick={() => navigate('/add-to-queue')}
          >
            Book Appointment →
          </button>
        </div>
      </section>

      {/* Section 4: Partner Clinics */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Our Partner Clinics</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Trusted clinics ensuring quality healthcare services across different locations.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {thirdCardsData?.map((card, index) => (
                <div key={index} className="transition-all duration-200 hover:shadow-lg">
                  <ThirdCard {...card} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Additional Info */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-xl font-medium text-gray-800 mb-5">PHC Facilities</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Qualified medical professionals and specialists</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Diagnostic laboratory and equipment</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Mental health counseling</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Online appointment booking system</span>
                </li>
              </ul>
            </div>

            <div className="md:w-1/2">
              <div className="grid grid-cols-1 gap-5">
                <div className="bg-white p-5 rounded-md shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Emergency Contact</h3>
                  <div className="flex items-center">
                    <div className="mr-4 bg-red-50 rounded-full p-2">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-lg font-medium text-red-700">0291 280 1190</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-md shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Location</h3>
                  <p className="text-gray-700">Primary Health Center, Student Activity Center, North Campus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;