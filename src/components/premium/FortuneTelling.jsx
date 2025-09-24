// src/components/premium/FortuneTelling.jsx
import React from 'react'
import { Star, Moon, Sun } from 'lucide-react'

const FortuneTelling = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Fortune Telling</h2>
        <p className="text-gray-600">Discover what the future holds</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Astrology</h3>
          <p className="text-gray-600">Read your daily horoscope</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Moon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Moon Phase</h3>
          <p className="text-gray-600">Understand lunar influences</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Sun className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Solar Reading</h3>
          <p className="text-gray-600">Solar energy guidance</p>
        </div>
      </div>
    </div>
  )
}

export default FortuneTelling
