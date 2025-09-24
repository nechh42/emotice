// src/components/premium/TarotCards.jsx
import React, { useState } from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'

const TarotCards = () => {
  const [selectedCards, setSelectedCards] = useState([])
  const [showReading, setShowReading] = useState(false)

  const cards = [
    { id: 1, name: 'The Fool', meaning: 'New beginnings', image: '' },
    { id: 2, name: 'The Magician', meaning: 'Manifestation', image: '' },
    { id: 3, name: 'The High Priestess', meaning: 'Intuition', image: '' }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tarot Card Reading</h2>
        <p className="text-gray-600">Select 3 cards for your reading</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer hover:shadow-xl transition-shadow">
            <div className="text-6xl mb-4">{card.image}</div>
            <h3 className="font-semibold">{card.name}</h3>
            <p className="text-sm text-gray-600">{card.meaning}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          <Sparkles className="w-5 h-5 inline mr-2" />
          Get Reading
        </button>
      </div>
    </div>
  )
}

export default TarotCards
