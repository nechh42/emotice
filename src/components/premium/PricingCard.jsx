import React from 'react'
import { Crown } from 'lucide-react'

const PricingCard = ({ plan, isPopular, onSelect }) => {
  return (
    <div className="relative p-6 rounded-xl border-2 border-gray-200 bg-white">
      {isPopular && (
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
  {plan.monthlyEffective !== plan.price && (
    <p className="text-sm text-gray-500">Aylık efektif ${plan.monthlyEffective}</p>
  )}
  {plan.discount > 0 && (
    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mt-2">
      %{plan.discount} indirim
    </span>
  )}
</div>

      <button
        onClick={() => onSelect(plan.id)}
        className="w-full py-3 px-4 rounded-lg font-semibold transition-colors bg-purple-600 hover:bg-purple-700 text-white"
      >
        Seç
      </button>
    </div>
  )
}

export default PricingCard