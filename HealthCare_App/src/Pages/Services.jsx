import React, {useState, useEffect} from 'react';
import ServiceCard from '../Components/ServiceCard';
import { useNavigate } from 'react-router-dom';
import {GetServicesPageData} from '../Server/Server.js'

function Services() {
  const navigate = useNavigate();
  
  // Array of services


  const [pageData, setPageData] = useState([]);

  const getPageData = async () => {
    try {
      const data = await GetServicesPageData();
      // console.log("page data:- ", data);
      setPageData(data);
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
      {/* Hero Section */}
      <div className="bg-green-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold">Our Services</h1>
        <p className="text-lg mt-4">Providing a wide range of healthcare solutions for your needs.</p>
      </div>

      {/* Services Section */}
      <div className="py-16 px-5 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">What We Offer</h2>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {/* Service 1 */}

          {pageData?.map((service, index) => (
            <ServiceCard key={index} title={service?.title} description={service?.description} imgsrc={service?.
              image_url} />
          ))}

        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-5 md:px-20 text-center bg-green-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Health, Our Priority</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          Take the first step towards better health today. Explore our services and see how we can help.
        </p>
        <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg text-lg shadow-md hover:bg-green-700"
        onClick={() => navigate('/contact')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Services;
