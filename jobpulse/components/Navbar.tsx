'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow border-2 border-blue-600">
              <img src="/logo.png" alt="JobPulse India" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg text-gray-800 hidden md:inline">
              JobPulse India
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-blue-600">
              Search
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-blue-600">
              Profile
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/search" className="block py-2 text-gray-700 hover:text-blue-600">
              Search
            </Link>
            <Link href="/profile" className="block py-2 text-gray-700 hover:text-blue-600">
              Profile
            </Link>
            <div className="flex space-x-4 mt-4">
              <Link href="/auth/login" className="flex-1 text-center px-4 py-2 border border-blue-600 rounded-lg">
                Login
              </Link>
              <Link href="/auth/register" className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
