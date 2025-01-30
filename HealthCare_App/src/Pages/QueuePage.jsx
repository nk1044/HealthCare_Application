import React, { useEffect, useState, useCallback } from 'react';
import { GetQueueData } from '../Server/Server';
import { useNavigate } from 'react-router-dom';

const tags = ['All', 'General', 'ENT', 'Dentist'];

function QueuePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [tag, setTag] = useState('All');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetQueueData();
                setData(response || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching queue data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    // Filter entries based on the selected tag
    const filterEntries = useCallback(() => {
        if (tag === 'All') {
            setEntries(data.flatMap(entry => entry.Entries.map(e => ({ ...e, tag: entry.tag }))));
        } else {
            const filtered = data
                .filter(entry => entry.tag === tag)
                .flatMap(entry => entry.Entries.map(e => ({ ...e, tag: entry.tag })));
            setEntries(filtered);
        }
    }, [data, tag]);

    // Apply filtering when `tag` or `data` changes
    useEffect(() => {
        filterEntries();
    }, [tag, data, filterEntries]);

    return (
        <div className="p-6">
            {/* Dropdown */}
            <div className="relative inline-block text-left w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow ring-1 ring-gray-300 hover:bg-gray-50"
                >
                    {tag}
                    <img src="https://img.icons8.com/?size=100&id=60662&format=png&color=000000" className="w-6" alt="Dropdown" />
                </button>

                {isOpen && (
                    <ul className="absolute left-0 z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                        {tags.map((t, idx) => (
                            <li key={idx} onClick={() => { setTag(t); setIsOpen(false); }}>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                    {t}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Queue List */}
            <div className="mt-10 w-full flex flex-col items-center">
                <h1 className="text-xl font-bold mb-4">Queue</h1>

                {loading ? (
                    <p className="text-gray-600">Loading...</p>
                ) : entries.length === 0 ? (
                    <p className="text-gray-600">No entries available.</p>
                ) : (
                    <div className="w-full px-10 space-y-4">
                        {entries.map((entry) => (
                            <div key={entry._id} className="p-4 bg-white shadow-md rounded-md flex justify-between items-center">
                                <p className="text-sm text-gray-600 font-bold">Tag: {entry.tag}</p>
                                <p className="text-sm text-gray-800">{entry.description}</p>
                                <button
                                    className="w-20 rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm bg-indigo-600 text-white hover:bg-indigo-500"
                                    onClick={() => {
                                        navigate(`/video-call?roomID=${entry?.roomID}`);
                                        // console.log('Connect to:', entry);
                                    }}
                                >
                                    Connect
                                </button>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QueuePage;
