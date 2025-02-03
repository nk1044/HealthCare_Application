import React, { useState, useCallback, useEffect } from 'react';
import { useUser } from '../Store/zustand.js';
import { LogOut } from '../Server/Server.js';
import Button from './Button.jsx';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const user = useUser(useCallback(state => state.user, []));
    const setUser = useUser(useCallback(state => state.setUser, []));
    const navigate = useNavigate();
    // console.log("user:- ", user?.avatar);
    
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        setUser(null);
        setDropdownOpen(false);
        await LogOut();
    };

    useEffect(() => {
        setDropdownOpen(false);
        setMenuOpen(false);
    }, [navigate, user, setUser]);

    return (
        <nav className="bg-gray-100 border-b border-gray-300 shadow-lg">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto py-3 px-4 md:px-6">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}> 
                    <img
                        src="https://iitj.ac.in/images/logo/Design-of-New-Logo-of-IITJ-2.png"
                        className="h-10 rounded-full shadow-md"
                        alt="Logo"
                    />
                    <span className="text-2xl font-semibold text-gray-800">HealthCare</span>
                </div>

                <div className="hidden md:flex space-x-6 cursor-pointer">
                    <div onClick={() => navigate("/")} className="text-gray-800 hover:text-blue-700 transition">Dashboard</div>
                    <div onClick={() => navigate("/about")} className="text-gray-800 hover:text-blue-700 transition">About</div>
                    <div onClick={() => navigate("/services")} className="text-gray-800 hover:text-blue-700 transition">Services</div>
                    <div onClick={() => navigate("/contact")} className="text-gray-800 hover:text-blue-700 transition">Contact</div>
                    {user && (
                        <>
                            <div onClick={() => navigate("/queue-page")} className="text-gray-800 hover:text-blue-700 transition">Queue Page</div>
                            <div onClick={() => navigate("/add-to-queue")} className="text-gray-800 hover:text-blue-700 transition">Consult Online</div>
                        </>
                    )}
                </div>

                {user ? (
                    <div className="relative hidden md:flex items-center space-x-4 rtl:space-x-reverse">
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            className="flex items-center justify-center w-10 h-10 border-2 border-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <img
                                className="w-8 h-8 rounded-full text-white"
                                src={user?.avatar?.trim() ?? "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"}
                                alt="User"
                            />

                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 text-white top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 z-10">
                                <div className="px-4 py-3">
                                    <p className="text-sm font-medium text-gray-300">{user?.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <ul className="py-2 text-white cursor-pointer">
                                    {/* <li>
                                        <div
                                            onClick={() => navigate("/user/profile")}
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black transition"
                                        >
                                            Profile
                                        </div>
                                    </li>
                                    <li>
                                        <div
                                            onClick={() => navigate("/user/settings")}
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black transition"
                                        >
                                            Settings
                                        </div>
                                    </li> */}
                                    <li>
                                        <span
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black transition"
                                            onClick={handleLogout}
                                        >
                                            Sign out
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="hidden md:flex space-x-4 items-center">
                        <Button
                            text="Login"
                            onClick={() => navigate("/login-user")}
                        />
                        <Button
                            text="register"
                            onClick={() => navigate("/register-user")}
                            class_Name='bg-indigo-600 text-white hover:bg-indigo-500 '
                        />
                    </div>
                )}

                <button className="block md:hidden text-gray-800 focus:outline-none" onClick={toggleMenu}>
                    {isMenuOpen ? <span className="text-2xl">✖</span> : <span className="text-2xl">☰</span>}
                </button>
            </div>

            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-300 shadow-md md:hidden z-20">
                    <div className="flex flex-col items-center space-y-4 py-4">
                        <div onClick={() => { navigate("/"); setMenuOpen(false); }} className="text-gray-800 hover:text-blue-700 transition">Dashboard</div>
                        <div onClick={() => { navigate("/about"); setMenuOpen(false); }} className="text-gray-800 hover:text-blue-700 transition">About</div>
                        <div onClick={() => { navigate("/services"); setMenuOpen(false); }} className="text-gray-800 hover:text-blue-700 transition">Services</div>
                        <div onClick={() => { navigate("/contact"); setMenuOpen(false); }} className="text-gray-800 hover:text-blue-700 transition">Contact</div>
                        {user && (
                            <>
                                <div onClick={() => { navigate("/queue-page"); setMenuOpen(false); }} className="text-gray-800 hover:text-blue-700 transition">Queue Page</div>
                                <div onClick={() => { navigate("/add-to-queue"); setMenuOpen(false); }} className="text-gray-800 hover:text-blue-700 transition">Consult Online</div>
                            </>
                        )}
                        {!user ? (
                            <>
                                <Button text="Login" onClick={() => { navigate("/login-user"); setMenuOpen(false); }} />
                                <Button text="Register" onClick={() => { navigate("/register-user"); setMenuOpen(false); }} class_Name="bg-indigo-600 text-white hover:bg-indigo-500 " />
                            </>
                        ) : (
                            <div className="text-gray-800 hover:text-red-600 transition cursor-pointer" onClick={handleLogout}>Sign out</div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
