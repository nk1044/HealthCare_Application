import React, { useCallback, useEffect, useState } from 'react';
import { AddEntryToQueue, DeleteQueueEntry, getDataByUser } from '../Server/Server.js';
import { useNavigate } from 'react-router-dom';
import Loading from '../Pages/Loading.jsx';
import { useUser } from '../Store/zustand.js';

function AddToQueue() {
  const [tags, setTags] = useState(["ENT", "General", "Dentist"]);
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const navigate = useNavigate();
  const user = useUser(useCallback(state => state.user, []));
  const [Queue_Id, setQueue_Id] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getDataByUser(user._id);
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
  }, [user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tag === "" || description === "") {
      alert("Please fill all the fields");
    } else {
      setLoading(true);
      try {
        const res = await AddEntryToQueue({
          tag: tag,
          description: description
        });
        if (res) {
          console.log("User added to queue successfully");
          // Instead of navigating, fetch and display queue data
          const userData = await getDataByUser(user._id);
          if (userData && userData.userEntry) {
            setQueueData(userData.userEntry);
            setQueue_Id(userData.queueId);
          }
        } else {
          alert("Error adding user to queue");
        }
      } catch (error) {
        console.error("Error in submission:", error);
        alert("Error adding user to queue");
      }
      setLoading(false);
    }
  };

  const handleDelete = () => {
    DeleteQueueEntry({userId: user._id, Queue_Id});
    setQueueData(null);
  };

  const renderQueueDetails = () => {
    return (
      <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Queue Details</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-1">Tag</p>
            <p className="font-medium text-gray-800">{queueData.tag}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="font-medium text-gray-800">{queueData.description}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-1">Room ID</p>
            <p className="font-medium text-gray-800">{queueData.roomID}</p>
          </div>
          <div className="mt-8 text-center flex gap-6 justify-center">
            <button
              onClick={() => navigate(`/video-call?roomID=${queueData.roomID}`)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg shadow-md hover:bg-green-700"
            >
              Join Video Call
            </button>
            <button
              onClick={() => handleDelete()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg shadow-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Join Queue</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="tag">
              Tag
            </label>
            <select
              id="tag"
              name="tag"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="" disabled defaultValue>
                Select a Tag
              </option>
              {tags.map((tagOption) => (
                <option key={tagOption} value={tagOption}>
                  {tagOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              name="description"
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
    );
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="py-16 px-5 md:px-20 bg-white">
          {queueData ? renderQueueDetails() : renderForm()}
        </div>
      )}
    </div>
  );
}

export default AddToQueue;