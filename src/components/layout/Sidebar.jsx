// src/components/layout/Sidebar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, BarChart3, Heart, Settings, Star, 
  X, Calendar, User, Crown
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Mood Tracker', href: '/mood-tracker', icon: Heart },
    { name: 'History', href: '/history', icon: BarChart3 },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Premium', href: '/premium', icon: Crown },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform md:relative md:translate-x-0">
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={onClose} className="p-2 rounded-md text-gray-600 hover:text-gray-900 md:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
