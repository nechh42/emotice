import React, { useState } from "react"
import { User, Mail, Calendar, Settings, LogOut } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

const Profile = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
    window.location.reload()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <span>Demo Kullanici</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <span>demo@emotice.com</span>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-3 px-4 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Cikis Yap
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
