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
        navigate("/");
    };

    useEffect(() => {
        setDropdownOpen(false);
        setMenuOpen(false);
    }, [navigate, user, setUser]);

    const isActive = (path) => {
        return window.location.pathname === path ? 'text-blue-600 font-medium' : 'text-gray-700';
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                        <img
                            src="https://iitj.ac.in/images/logo/Design-of-New-Logo-of-IITJ-2.png"
                            className="h-10 w-10 object-contain"
                            alt="HealthCare Logo"
                        />
                        <span className="ml-3 text-xl font-semibold text-gray-900">HealthCare</span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div onClick={() => navigate("/")} className={`${isActive("/")} hover:text-blue-500 cursor-pointer transition-colors duration-200 px-1 py-2`}>Home</div>
                        <div onClick={() => navigate("/services")} className={`${isActive("/services")} hover:text-blue-500 cursor-pointer transition-colors duration-200 px-1 py-2`}>Services</div>
                        <div onClick={() => navigate("/about")} className={`${isActive("/about")} hover:text-blue-500 cursor-pointer transition-colors duration-200 px-1 py-2`}>About</div>
                        <div onClick={() => navigate("/contact")} className={`${isActive("/contact")} hover:text-blue-500 cursor-pointer transition-colors duration-200 px-1 py-2`}>Contact</div>
                        
                        {user && (
                            <>
                                {(user.role === 'doctor' || user.role === 'admin') && (
                                    <div onClick={() => navigate("/queue-page")} className={`${isActive("/queue-page")} hover:text-blue-500 cursor-pointer transition-colors duration-200 px-1 py-2`}>OPD</div>
                                )}
                                {(user.role === 'user' || user.role === 'admin') && (
                                    <div onClick={() => navigate("/add-to-queue")} className={`${isActive("/add-to-queue")} hover:text-blue-500 cursor-pointer transition-colors duration-200 px-1 py-2`}>Consult Online</div>
                                )}
                            </>
                        )}
                    </div>

                    {/* User Profile or Login/Register */}
                    <div className="hidden md:flex items-center">
                        {user ? (
                            <div className="relative ml-3">
                                <button
                                    type="button"
                                    onClick={toggleDropdown}
                                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="flex items-center">
                                        <span className="mr-2 text-sm font-medium text-gray-700">{user.name}</span>
                                        <img
                                            className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                            src={user?.avatar?.trim() ?? "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"}
                                            alt="User"
                                        />
                                    </div>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div onClick={() => navigate('/user/profile')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                                            Profile
                                        </div>
                                        <div onClick={() => navigate('/user/settings')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                                            Settings
                                        </div>
                                        <div onClick={handleLogout} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer">
                                            Sign out
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Button
                                    text="Login"
                                    onClick={() => navigate("/login-user")}
                                    class_Name="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                />
                                <Button
                                    text="Register"
                                    onClick={() => navigate("/register-user")}
                                    class_Name="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-gray-100 focus:outline-none"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <div onClick={() => { navigate("/"); setMenuOpen(false); }} 
                            className={`${isActive("/")} block px-3 py-2 rounded-md text-base hover:bg-gray-50 cursor-pointer`}>
                            Home
                        </div>
                        <div onClick={() => { navigate("/services"); setMenuOpen(false); }} 
                            className={`${isActive("/services")} block px-3 py-2 rounded-md text-base hover:bg-gray-50 cursor-pointer`}>
                            Services
                        </div>
                        <div onClick={() => { navigate("/about"); setMenuOpen(false); }} 
                            className={`${isActive("/about")} block px-3 py-2 rounded-md text-base hover:bg-gray-50 cursor-pointer`}>
                            About
                        </div>
                        <div onClick={() => { navigate("/contact"); setMenuOpen(false); }} 
                            className={`${isActive("/contact")} block px-3 py-2 rounded-md text-base hover:bg-gray-50 cursor-pointer`}>
                            Contact
                        </div>
                        
                        {user && (
                            <>
                                {(user.role === 'doctor' || user.role === 'admin') && (
                                    <div onClick={() => { navigate("/queue-page"); setMenuOpen(false); }} 
                                        className={`${isActive("/queue-page")} block px-3 py-2 rounded-md text-base hover:bg-gray-50 cursor-pointer`}>
                                        OPD
                                    </div>
                                )}
                                {(user.role === 'user' || user.role === 'admin') && (
                                    <div onClick={() => { navigate("/add-to-queue"); setMenuOpen(false); }} 
                                        className={`${isActive("/add-to-queue")} block px-3 py-2 rounded-md text-base hover:bg-gray-50 cursor-pointer`}>
                                        Consult Online
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                    {/* Mobile user section */}
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        {user ? (
                            <>
                                <div className="flex items-center px-4 py-2">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                            src={user?.avatar?.trim() ?? "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"}
                                            alt="User"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    <div onClick={() => { navigate("/user/profile"); setMenuOpen(false); }} 
                                        className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        Profile
                                    </div>
                                    <div onClick={() => { navigate("/user/settings"); setMenuOpen(false); }} 
                                        className="block px-3 py-2 rounded-md text-base text-gray-700 hover:bg-gray-50 cursor-pointer">
                                        Settings
                                    </div>
                                    <div onClick={() => { handleLogout(); setMenuOpen(false); }} 
                                        className="block px-3 py-2 rounded-md text-base text-red-600 hover:bg-gray-50 cursor-pointer">
                                        Sign out
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="px-2 py-3 flex flex-col space-y-2">
                                <Button
                                    text="Login"
                                    onClick={() => { navigate("/login-user"); setMenuOpen(false); }}
                                    class_Name="w-full py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center"
                                />
                                <Button
                                    text="Register"
                                    onClick={() => { navigate("/register-user"); setMenuOpen(false); }}
                                    class_Name="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 text-center"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;