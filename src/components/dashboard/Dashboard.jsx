import React from "react"
import { Heart, BarChart3, Calendar, TrendingUp } from "lucide-react"

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Duygusal saglik takibinize hosgeldiniz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Bugunku Ruh Hali</p>
              <p className="text-2xl font-bold">Iyi</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Gunluk Kayit</p>
              <p className="text-2xl font-bold">7</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Bu Hafta</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Trend</p>
              <p className="text-2xl font-bold">+12%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Hizli Islemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => window.location.href = "/mood"} className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Heart className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium">Ruh Hali Kaydet</p>
          </button>
          <button onClick={() => window.location.href = "/history"} className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium">Istatistikleri Gor</p>
          </button>
          <button onClick={() => window.location.href = "/history"} className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Calendar className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium">Gecmis Kayitlar</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

