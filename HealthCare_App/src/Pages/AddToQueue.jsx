import React, { useCallback, useEffect, useState } from 'react';
import { AddEntryToQueue, DeleteQueueEntry, getAllDoctor, getDataByUser } from '../Server/Server.js';
import { useNavigate } from 'react-router-dom';
import Loading from '../Pages/Loading.jsx';
import { useUser } from '../Store/zustand.js';
import ChatBox from '../Components/ChatBox.jsx';
import toast, { Toaster } from 'react-hot-toast';
import PopUp from '../Components/PopUp.jsx';

function AddToQueue() {
  const [tags, setTags] = useState(["ENT", "General", "Dentist"]);
  const [tag, setTag] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const navigate = useNavigate();
  const user = useUser(useCallback(state => state.user, []));
  const [Queue_Id, setQueue_Id] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user._id) return;

      try {
        setLoading(true);
        const userData = await getDataByUser(user._id);
        const allDoctors = await getAllDoctor();
        setDoctors(allDoctors);
        if (userData && userData.userEntry) {
          setQueueData(userData.userEntry);
          setQueue_Id(userData.queueId);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tag === "" || description === "") {
      // alert("Please fill all the fields");
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      const res = await AddEntryToQueue({
        tag: tag,
        description: description,
        doctorId: doctor,
      });
      // console.log("Response:", res);

      if (res) {
        console.log("User added to queue successfully");
        const userData = await getDataByUser(user._id);
        if (userData && userData.userEntry) {
          setQueueData(userData.userEntry);
          setQueue_Id(userData.queueId);
        }
      } else {
        // alert("Error adding user to queue");
        toast.error("Error adding user to queue");
      }
    } catch (error) {
      console.error("Error in submission:", error);
      // alert("Error adding user to queue");
      toast.error("Error adding user to queue");
    }
    setLoading(false);
  };

  // Handle queue entry deletion
  const handleDelete = async () => {
    setLoading(true);
    try {
      setModalOpen(false);
      await DeleteQueueEntry({ userId: user._id, Queue_Id });
      setQueueData(null);
    } catch (error) {
      console.error("Error deleting queue entry:", error);
    }
    setLoading(false);
  };

  // Get tag color for visual indication
  const getTagColor = (tagName) => {
    switch (tagName) {
      case 'General': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ENT': return 'bg-green-100 text-green-800 border-green-200';
      case 'Dentist': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const renderQueueDetails = () => {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Queue Details</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(queueData.tag)}`}>
              {queueData.tag}
            </span>
          </div>
          <p className="text-blue-100 mt-2">You're currently in the queue. A healthcare professional will connect with you shortly.</p>
        </div>

        <div className="p-1 sm:p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p className="font-medium text-gray-800">{queueData.description}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-500 mb-1">Room ID</p>
              <div className="flex items-center">
                <p className="font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded">{queueData.roomID}</p>
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => { navigator.clipboard.writeText(queueData.roomID) }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Improved Chat Component */}
          <ChatBox roomId={queueData.roomID} />

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigate(`/video-call?roomID=${queueData.roomID}`)}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Join Video Call
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-red-300 text-red-700 bg-white rounded-lg text-lg font-medium shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Leave
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
          <p className="text-blue-100 mt-2">Fill in the details below to join the consultation queue. A healthcare professional will attend to you soon.</p>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tag">
              Department
            </label>
            <div className="relative border rounded-lg">
              <select
                id="tag"
                name="tag"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-10 py-2 text-base focus:outline-none"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="" disabled>Select a department</option>
                {tags.map((tagOption) => (
                  <option key={tagOption} value={tagOption}>
                    {tagOption}
                  </option>
                ))}
              </select>

            </div>
            {tag && (
              <p className="mt-2 text-sm text-gray-500">
                You've selected the {tag} department.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tag">
              Doctor
            </label>
            <div className="relative border rounded-lg">
              <select
                id="tag"
                name="tag"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-10 py-2 text-base focus:outline-none"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              >
                <option value="" disabled>Select a doctor</option>
                {doctors && doctors.map((doctor) => (
                  <option key={doctor.name} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>

            </div>
            {doctor && (
              <p className="mt-2 text-sm text-gray-500">
                You've selected {doctors.find((e) => e._id == doctor)?.name}.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
              Reason for Visit
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              name="description"
              rows="4"
              placeholder="Please briefly describe your symptoms or reason for consultation..."
              className="block w-full border rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none p-3"
            ></textarea>
            <p className="mt-2 text-sm text-gray-500">
              Provide a brief description of your symptoms or concerns. This helps the healthcare provider prepare for your consultation.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Privacy Notice</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Your information is secure and will only be shared with healthcare professionals attending to your case.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Consult A Doctor'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Virtual Consultation</h1>
        <p className="mt-2 text-lg text-gray-600 text-center">Connect with healthcare professionals from the comfort of your home</p>
      </div>

      {loading ? (
        <div className="w-full">
          <Loading />
        </div>
      ) : (
        <div className="transition-all duration-300 ease-in-out">
          {queueData ? renderQueueDetails() : renderForm()}
        </div>
      )}
      <PopUp
        isOpen={isModalOpen}
        title="Are you sure?"
        message="Do you really want to leave? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}

export default AddToQueue;
