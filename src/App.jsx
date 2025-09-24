import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [connected, setConnected] = useState(false)
  
  useEffect(() => {
    // Supabase bağlantısını test et
    supabase.from('profiles').select('count').limit(1)
      .then(() => setConnected(true))
      .catch(() => setConnected(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">EMOTICE</h1>
        <p className="text-xl text-gray-700">Duygusal Sağlık Takibi</p>
        
        <div className="mt-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {connected ? '✅ Supabase Bağlı' : '❌ Supabase Bağlantı Hatası'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App