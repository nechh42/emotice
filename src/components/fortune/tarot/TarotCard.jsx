import React, { useState } from 'react';
import { RotateCcw, Info, Heart, Briefcase, Activity } from 'lucide-react';

const TarotCard = ({ 
  card, 
  isRevealed = false, 
  isReversed = false, 
  onClick, 
  size = 'medium',
  showDetails = true 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    small: 'w-20 h-32',
    medium: 'w-32 h-48',
    large: 'w-40 h-60'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm', 
    large: 'text-base'
  };

  const cardData = isReversed ? card.reversed : card.upright;

  return (
    <div className="relative group">
      {/* Card */}
      <div
        className={`
          ${sizeClasses[size]} 
          relative cursor-pointer transition-all duration-500 transform-gpu
          ${isRevealed ? 'scale-105' : 'hover:scale-102'} 
          ${onClick ? 'hover:shadow-xl' : ''}
          ${isReversed ? 'rotate-180' : ''}
        `}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Card Back */}
        {!isRevealed && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-600 to-pink-600 rounded-xl shadow-lg border border-purple-300">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🌟</div>
                <div className="text-xs font-medium opacity-80">EMOTICE</div>
                <div className="text-xs opacity-60">TAROT</div>
              </div>
            </div>
            {/* Mystical pattern overlay */}
            <div className="absolute inset-2 border border-white border-opacity-20 rounded-lg">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border border-white border-opacity-30 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Front */}
        {isRevealed && (
          <div className={`
            absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100 
            rounded-xl shadow-xl border-2 border-gold-300 overflow-hidden
            ${isReversed ? 'rotate-180' : ''}
          `}>
            {/* Card Header */}
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className={`text-center ${textSizeClasses[size]}`}>
                <div className="font-bold truncate">{card.nameTr}</div>
                <div className={`${textSizeClasses[size]} opacity-80 truncate`}>{card.name}</div>
              </div>
            </div>

            {/* Card Image/Symbol */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className={`
                text-center
                ${size === 'large' ? 'text-6xl' : size === 'medium' ? 'text-4xl' : 'text-2xl'}
              `}>
                {card.image}
              </div>
            </div>

            {/* Keywords */}
            <div className="p-2 bg-white bg-opacity-80">
              <div className={`text-center ${textSizeClasses[size]} text-gray-700`}>
                {card.keywords.slice(0, 2).map((keyword, index) => (
                  <span key={keyword}>
                    {keyword}
                    {index < 1 && card.keywords.length > 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Reversed indicator */}
            {isReversed && (
              <div className="absolute top-2 right-2">
                <RotateCcw className="w-4 h-4 text-red-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tooltip with card details */}
      {showTooltip && isRevealed && showDetails && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="text-center mb-3">
              <h3 className="font-bold text-lg text-gray-800">
                {card.nameTr}
                {isReversed && <span className="text-red-500 ml-2">(Ters)</span>}
              </h3>
              <p className="text-sm text-gray-600">{card.name}</p>
            </div>

            {/* General meaning */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm text-gray-700">Genel Anlam</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {cardData.general}
              </p>
            </div>

            {/* Love, Career, Health meanings */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Heart className="w-3 h-3 text-red-500 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-gray-700">Aşk:</span>
                  <p className="text-xs text-gray-600">{cardData.love}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Briefcase className="w-3 h-3 text-blue-500 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-gray-700">Kariyer:</span>
                  <p className="text-xs text-gray-600">{cardData.career}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Activity className="w-3 h-3 text-green-500 mt-0.5" />
                <div>
                  <span className="font-semibold text-xs text-gray-700">Sağlık:</span>
                  <p className="text-xs text-gray-600">{cardData.health}</p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {card.keywords.map((keyword) => (
                  <span 
                    key={keyword} 
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotCard;