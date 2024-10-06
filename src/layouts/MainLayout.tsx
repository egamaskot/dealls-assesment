import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {  } from 'lucide-react';
import Menu from '../assets/image/menu.svg'

const MainLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
        <header className="sticky top-0 bg-[#6913D8] text-white shadow-md">
            <div className="container max-w-[1440px] mx-auto px-10">
                <div className="flex items-center justify-between py-2">
                    <div className='flex flex-row'>
                        <a href="/">
                            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="Dealls logo" />
                        </a>
                    </div>
                    <div>
                        <button 
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <img src={Menu} alt="menu-mobile"/>
                        </button>
                        <nav className="hidden md:flex space-x-2 text-xs ml-5 md:items-center">
                            <Link to="/" className="hover:text-blue-200">Home</Link>
                            <Link to="/article" className="hover:text-blue-200">Article</Link>
                            <Link to="/contact" className="hover:text-blue-200">Contact</Link>
                        </nav>
                    
                    </div>
                </div>

                {isMenuOpen && (
                    <nav className="md:hidden py-4">
                        <Link to="/" className="block py-2 hover:text-blue-200">Home</Link>
                        <Link to="/article" className="block py-2 hover:text-blue-200">Article</Link>
                        <Link to="/contact" className="block py-2 hover:text-blue-200">Contact</Link>
                    </nav>
                )}
            </div>
        </header>

        <main className="main bg-[#efedf6] pb-20">
            <Outlet />
        </main>

        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center text-xs">
            © {new Date().getFullYear()} Muhammad Ega Abdan Syakuro. All rights reserved.
            </div>
        </footer>
        </div>
    );
};

export default MainLayout;