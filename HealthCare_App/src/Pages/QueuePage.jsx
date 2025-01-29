import React, { useState } from 'react'

function QueuePage() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <div className='w-full  bg-gray-100'>
                <div className="relative inline-block text-left ml-32">
                    <div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                        >
                            Options
                            <img src='https://img.icons8.com/?size=100&id=60662&format=png&color=000000' className='w-6' />
                        </button>
                    </div>

                    {isOpen && (
                        <ul
                            className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-none"
                        >
                            <li className="py-1">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    General
                                </a>
                            </li>
                            <li className="py-1">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    ENT
                                </a>
                            </li>
                            <li className="py-1">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    Dentist
                                </a>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
            <div className='h-svh'>
                    hllo
            </div>
        </div>
    )
}

export default QueuePage
