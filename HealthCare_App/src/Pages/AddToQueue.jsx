import React, { useState } from 'react';
import {AddEntryToQueue} from '../Server/Server.js';
import { useNavigate } from 'react-router-dom';
import Loading from '../Pages/Loading.jsx';

function AddToQueue() {

  // const tags = ["ENT", "General", "Dentist"];
  const [tags, setTags] = useState(["ENT", "General", "Dentist"]);
  const [tag, setTag] = useState("");
  const [Description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(tag, Description);
    if(tag === "" || Description === "") {
      alert("Please fill all the fields");
    } else {
      setLoading(true);
      const res = await AddEntryToQueue({
        tag: tag, 
        description: Description
      });
      if(res) {
        console.log("User added to queue successfully");
        navigate(`/video-call?roomID=${res}`);
      } else {
        alert("Error adding user to queue");
      }
      setLoading(false);
    }
  };

  return (
    <div>
     {loading ? <Loading /> :
      <div className="py-16 px-5 md:px-20 bg-white">
      <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
        <form className="space-y-6" 
          onSubmit={handleSubmit}>
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
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
              Description
            </label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              id="Description"
              name="Description"
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
    }
    </div>
  )
}

export default AddToQueue