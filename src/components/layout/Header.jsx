// src/components/layout/Header.jsx
import React from 'react'
import { Heart, Menu } from 'lucide-react'

const Header = ({ onMenuClick }) => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="p-2 rounded-md text-gray-600 hover:text-gray-900 md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center ml-4 md:ml-0">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Emotice</span>
          </div>
        </div>
      </div>
    </div>
  </header>
)

export default Header
