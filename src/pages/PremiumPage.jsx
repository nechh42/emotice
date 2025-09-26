import React, { useState } from 'react'
import { Crown, CreditCard, Lock, ArrowLeft } from 'lucide-react'

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const plans = [
    {
      id: 'monthly',
      name: 'Premium - Aylık',
      price: 16.99,
      duration: 1,
      discount: 0,
      isPopular: false
    },
    {
      id: '3month', 
      name: 'Premium - 3 Aylık',
      price: 44.99,
      duration: 3,
      discount: 12,
      monthlyEffective: 15.00,
      isPopular: true
    },
    {
      id: '6month',
      name: 'Premium - 6 Aylık', 
      price: 79.99,
      duration: 6,
      discount: 21,
      monthlyEffective: 13.33,
      isPopular: false
    }
  ]
  
  const handlePlanSelect = (plan) => {
    console.log('Plan seçildi:', plan)
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  const handlePayment = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Ödeme başarılı! Premium üyeliğiniz aktif edildi.')
      setShowPayment(false)
      setSelectedPlan(null)
    }, 2000)
  }

  const handleBackToPlans = () => {
    setShowPayment(false)
    setSelectedPlan(null)
  }

  // Payment Form Component
  if (showPayment && selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <button onClick={handleBackToPlans} className="mr-4">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">Ödeme</h2>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold">{selectedPlan.name}</h3>
              <p className="text-2xl font-bold text-purple-600">${selectedPlan.price}</p>
              <p className="text-sm text-gray-600">{selectedPlan.duration} ay</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Güvenli Ödeme
                </>
              )}
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              <CreditCard className="w-4 h-4 inline mr-1" />
              256-bit SSL şifreleme ile korunmaktadır
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Premium Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <Crown className="mx-auto text-yellow-500 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">EMOTICE Premium</h1>
          <p className="text-xl text-gray-600">Duygusal sağlığınız için gelişmiş özellikler</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative p-6 rounded-xl border-2 ${
                plan.isPopular 
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    Popüler
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                </div>
                {plan.monthlyEffective && (
                  <p className="text-sm text-gray-500">Aylık efektif ${plan.monthlyEffective}</p>
                )}
                {plan.discount > 0 && (
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mt-2">
                    %{plan.discount} indirim
                  </span>
                )}
              </div>

              <button
                onClick={() => handlePlanSelect(plan)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Seç
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Premium Özellikleri</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Ücretsiz</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Temel ruh hali takibi</li>
                <li>✓ 7 günlük geçmiş</li>
                <li>✓ Basit analytics</li>
                <li>✓ Topluluk desteği</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-600">Premium</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✨ Sınırsız geçmiş</li>
                <li>✨ Gelişmiş analytics</li>
                <li>✨ Kişisel AI insights</li>
                <li>✨ Veri export (CSV, PDF)</li>
                <li>✨ Premium içerikler</li>
                <li>✨ Öncelikli destek</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Vergiler ve bölgesel fiyat farklılıkları geçerlidir.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumPage