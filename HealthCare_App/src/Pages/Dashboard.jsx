import React, { useEffect, useState } from 'react';
import MedCard from '../Components/MedCard';
import SecondCard from '../Components/SecondCard';
import ThirdCard from '../Components/ThirdCard';
import { GetHomePageData } from '../Server/Server';

function Dashboard() {
  const [medCardsData, setMedCardsData] = useState([]);
  const [secondCardsData, setSecondCardsData] = useState([]);
  const [thirdCardsData, setThirdCardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPageData = async () => {
    setIsLoading(true);
    try {
      const data = await GetHomePageData();
      setMedCardsData(data?.featured_services);
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
      {/* Section 1: MedCards */}
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Featured Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore our top services for your health needs with personalized care and attention.</p>
        </div>
        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md w-80 h-64 animate-pulse">
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
            {medCardsData?.map((card, index) => (
              <div key={index} className="transition-all duration-200 hover:shadow-lg">
                <MedCard {...card} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Specialists */}
      <section className="py-12 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Meet Our Specialists</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Highly qualified specialists with years of experience ready to help you with your healthcare needs.</p>
        </div>
        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md w-80 h-64 animate-pulse">
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
      </section>

      {/* Section 3: Booking Info */}
      <section className="text-gray-800 text-center px-5 py-14 bg-blue-50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Book an Appointment for an In-Clinic Consultation</h2>
          <p className="text-lg mb-6">Find a clinic near you for personalized care and attention from our medical professionals.</p>
          
          <button className="text-xl font-bold bg-blue-600 px-6 py-3 rounded-lg text-white
           hover:bg-blue-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Book Appointment →
          </button>
        </div>
      </section>

      {/* Section 4: Partner Clinics */}
      <section className="py-12 bg-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Partner Clinics</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Trusted clinics ensuring quality healthcare services across different locations.</p>
        </div>
        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md w-80 h-64 animate-pulse">
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
      </section>
      
      {/* Section 5: Additional Info */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Our Healthcare Services?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Experienced medical professionals</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>State-of-the-art facilities and equipment</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Personalized treatment plans</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Convenient appointment scheduling</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Need Emergency Assistance?</h3>
                <p className="text-gray-600 mb-4">Our specialists are available 24/7 for urgent medical needs. Contact our emergency hotline for immediate assistance.</p>
                <div className="flex items-center justify-center bg-red-50 p-3 rounded-lg border border-red-100">
                  <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-lg font-bold text-red-700">Emergency: 0291 280 1190</span>
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