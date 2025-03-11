import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAboutPageData } from '../Server/Server';
import ServiceCard from '../Components/ServiceCard';


function About() {

  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);

  const getPageData = async () => {
    try {
      const data = await GetAboutPageData();
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
      <div className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-lg mt-4">Learn more about our mission, vision, and team.</p>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-5 md:px-20 text-center bg-white">
      <h2 className="text-xl font-medium text-gray-800 mb-4">Overview</h2>
        <p className="text-gray-700 leading-relaxed">
                The Primary Health Center (PHC) serves as the central healthcare facility for students, faculty, and staff. 
                Established to promote wellness and provide healthcare services, our center is equipped with modern facilities 
                and staffed by qualified healthcare professionals.
              </p>
      </div>

      {/* Team Section */}
      <div className="py-16 px-5 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          
          {pageData?.map((member, index) => (
            <ServiceCard key={index} title={member?.name} description={member?.position} imgsrc={member?.
              image_url} />
          //   <div 
          //   key={index}
          //   className="w-60 bg-white shadow-lg p-5 text-center">
          //   <img
          //     src={member?.image_url
          //     }
          //     alt="Team Member 1"
          //     className="w-24 h-24 mx-auto rounded-full object-cover"
          //   />
          //   <h3 className="text-lg font-bold mt-4 text-gray-800">{member?.name}</h3>
          //   <p className="text-sm text-gray-600">{member?.position}</p>
          // </div>
          ))}
        </div>
      </div>

      <section className="py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <h2 className="text-xl font-medium mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>0291 280 1190</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>phc@college.edu</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Student Activity Center, North Campus</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    className="px-4 py-2 bg-white text-blue-700 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                    onClick={() => navigate('/contact')}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
              
              <div className="md:w-1/2 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Operating Hours</h3>
                <table className="min-w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray-700">Monday - Friday</td>
                      <td className="py-3 font-medium text-gray-900 text-right">8:00 AM - 8:00 PM</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-gray-700">Saturday</td>
                      <td className="py-3 font-medium text-gray-900 text-right">9:00 AM - 6:00 PM</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-700">Sunday</td>
                      <td className="py-3 font-medium text-gray-900 text-right">10:00 AM - 2:00 PM</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                  <div className="flex">
                    <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium text-gray-800">Important Notice</p>
                      <p>For emergencies outside of operating hours, please contact campus security at 0291 280 1199.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
