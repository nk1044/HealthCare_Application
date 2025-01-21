import React, {useEffect, useState} from 'react';
import MedCard from '../Components/MedCard';
import SecondCard from '../Components/SecondCard';
import ThirdCard from '../Components/ThirdCard';
import { GetHomePageData } from '../Server/Server';

function Dashboard() {

  const [medCardsData, setMedCardsData] = useState([]);
  const [secondCardsData, setSecondCardsData] = useState([]);
  const [thirdCardsData, setThirdCardsData] = useState([]);



  const getPageData = async () => {
    try {
      const data = await GetHomePageData();
      // console.log("page data:- ", data);
      setMedCardsData(data?.featured_services);
      setSecondCardsData(data?.partner_clinics);
      setThirdCardsData(data?.specialists);
      // return data;
    } catch (err) {
      console.log('GetHomePageData failed', err);
    }
  }

  useEffect(() => {
    getPageData();
  }
  , []);


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Section 1: MedCards */}
      <section className="py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700">Our Featured Services</h2>
          <p className="text-gray-500">Explore our top services for your health needs.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {medCardsData.map((card, index) => (
            <MedCard key={index} {...card} />
          ))}
        </div>
      </section>


      {/* Section 3: Second Cards */}
      <section className="py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700">Meet Our Specialists</h2>
          <p className="text-gray-500">Highly qualified specialists ready to help you.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {secondCardsData.map((card, index) => (
            <SecondCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Section 4: Booking Info */}
      <section className="text-gray-700 text-center px-5 py-10 bg-white shadow-sm">
        
        <h2 className="text-3xl font-bold mb-2">Book an Appointment for an In-Clinic Consultation</h2>
        <p className="text-lg">Find a clinic near you for personalized care and attention.</p>
        
        <button className='text-xl font-bold bg-blue-500 px-3 py-2 border rounded-xl text-white mt-2
         hover:bg-blue-600 hover:shadow-md hover:scale-105 transition-transform'
        >Book Appointment →</button>

      </section>

      {/* Section 5: Third Cards */}
      <section className="py-10 bg-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700">Our Partner Clinics</h2>
          <p className="text-gray-500">Trusted clinics ensuring quality healthcare services.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {thirdCardsData.map((card, index) => (
            <ThirdCard key={index} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
