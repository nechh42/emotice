import React from "react"
import { Calendar, TrendingUp, Heart } from "lucide-react"

const MoodHistory = () => {
  const mockData = [
    { date: "2025-01-24", mood: "Iyi", score: 8 },
    { date: "2025-01-23", mood: "Orta", score: 6 },
    { date: "2025-01-22", mood: "Kotu", score: 4 },
    { date: "2025-01-21", mood: "Iyi", score: 7 },
    { date: "2025-01-20", mood: "Harika", score: 9 }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ruh Hali Gecmisi</h1>
        <p className="text-gray-600">Son gunlerdeki ruh hali degisiklikleriniz</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Son 5 Gun</h2>
        <div className="space-y-4">
          {mockData.map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{entry.date}</p>
                  <p className="text-sm text-gray-600">Ruh Hali: {entry.mood}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-bold">{entry.score}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
          <h2 className="text-xl font-bold">Ozet</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">7.0</p>
            <p className="text-sm text-gray-600">Ortalama Skor</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">2</p>
            <p className="text-sm text-gray-600">Iyi Gun</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">+15%</p>
            <p className="text-sm text-gray-600">Gelisim</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodHistory
