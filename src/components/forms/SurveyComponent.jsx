import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  Heart, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ArrowRight,
  ArrowLeft,
  BarChart3
} from 'lucide-react'
import { supabase, dbHelpers } from '../../lib/supabase'
import { surveyQuestions } from '../../data/surveyQuestions'
import { useAuth } from '../../hooks/useAuth'

const SurveyComponent = ({ onSurveyComplete, onBack }) => {
  const { user } = useAuth()
  const [currentSection, setCurrentSection] = useState(0) // 0: WHO-5, 1: PHQ-4, 2: Additional, 3: Results
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState({
    who5: {},
    phq4: {},
    additional: {}
  })
  const [scores, setScores] = useState({})
  const [riskAssessment, setRiskAssessment] = useState(null)

  const sections = [
    {
      key: 'who5',
      title: 'Genel İyilik Hali',
      subtitle: 'WHO-5 Ölçeği',
      icon: Heart,
      description: 'Son iki haftadaki genel ruh halinizi değerlendirin'
    },
    {
      key: 'phq4',
      title: 'Ruh Sağlığı Taraması',
      subtitle: 'PHQ-4 Ölçeği',
      icon: Brain,
      description: 'Depresyon ve anksiyete belirtilerini değerlendirin'
    },
    {
      key: 'additional',
      title: 'Ek Bilgiler',
      subtitle: 'Kişisel Tercihler',
      icon: Activity,
      description: 'Duygu takibi hedefleri ve ilgi alanlarını belirleyin'
    }
  ]

  // Calculate WHO-5 score
  const calculateWHO5Score = () => {
    const responses = Object.values(responses.who5)
    if (responses.length !== 5) return null
    
    const totalScore = responses.reduce((sum, score) => sum + score, 0)
    return totalScore * 4 // WHO-5 uses 0-100 scale
  }

  // Calculate PHQ-4 scores
  const calculatePHQ4Scores = () => {
    const phq4Responses = Object.values(responses.phq4)
    if (phq4Responses.length !== 4) return null

    // First 2 questions are depression (PHQ-2)
    const depressionScore = phq4Responses.slice(0, 2).reduce((sum, score) => sum + score, 0)
    
    // Last 2 questions are anxiety (GAD-2)  
    const anxietyScore = phq4Responses.slice(2, 4).reduce((sum, score) => sum + score, 0)
    
    return {
      depression: depressionScore,
      anxiety: anxietyScore,
      total: depressionScore + anxietyScore
    }
  }

  // Assess risk level based on scores
  const assessRiskLevel = (who5Score, phq4Scores) => {
    let riskLevel = 'low'
    let recommendations = []
    let requiresAttention = false

    // WHO-5 assessment (lower scores indicate poor wellbeing)
    if (who5Score <= 50) {
      riskLevel = 'moderate'
      recommendations.push('Genel iyilik halinizi artırmak için günlük aktivitelerinizi gözden geçirebilirsiniz.')
    }

    if (who5Score <= 28) {
      riskLevel = 'high'
      recommendations.push('Profesyonel destek almayı düşünmeniz önerilir.')
      requiresAttention = true
    }

    // PHQ-4 assessment
    if (phq4Scores.depression >= 3 || phq4Scores.anxiety >= 3) {
      riskLevel = Math.max(riskLevel === 'low' ? 'moderate' : riskLevel, 'moderate')
      
      if (phq4Scores.depression >= 3) {
        recommendations.push('Depresyon belirtileri için bir uzmanla görüşmeyi değerlendirebilirsiniz.')
      }
      
      if (phq4Scores.anxiety >= 3) {
        recommendations.push('Anksiyete belirtileri için gevşeme teknikleri ve uzman desteği faydalı olabilir.')
      }
    }

    if (phq4Scores.depression >= 5 || phq4Scores.anxiety >= 5) {
      riskLevel = 'high'
      requiresAttention = true
    }

    // Crisis assessment (would typically include suicidal ideation questions)
    // For demo purposes, we'll check for very high PHQ-4 scores
    if (phq4Scores.total >= 10) {
      riskLevel = 'crisis'
      requiresAttention = true
      recommendations.unshift('Acil profesyonel yardım almanız önemle tavsiye edilir.')
    }

    return {
      level: riskLevel,
      recommendations,
      requiresAttention,
      who5Score,
      phq4Scores
    }
  }

  // Handle response change
  const handleResponseChange = (section, questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [questionId]: parseInt(value)
      }
    }))
  }

  // Handle additional info change
  const handleAdditionalChange = (field, value) => {
    setResponses(prev => ({
      ...prev,
      additional: {
        ...prev.additional,
        [field]: value
      }
    }))
  }

  // Move to next section
  const handleNext = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1)
      
      // Calculate scores when moving to results
      if (currentSection === 2) {
        const who5Score = calculateWHO5Score()
        const phq4Scores = calculatePHQ4Scores()
        
        if (who5Score !== null && phq4Scores !== null) {
          const assessment = assessRiskLevel(who5Score, phq4Scores)
          setScores({ who5Score, phq4Scores })
          setRiskAssessment(assessment)
        }
      }
    }
  }

  // Move to previous section
  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    } else {
      onBack?.()
    }
  }

  // Save survey results
  const handleSaveSurvey = async () => {
    setLoading(true)
    try {
      const surveyData = {
        who5_score: scores.who5Score,
        who5_responses: Object.values(responses.who5),
        phq4_depression_score: scores.phq4Scores.depression,
        phq4_anxiety_score: scores.phq4Scores.anxiety,
        phq4_responses: Object.values(responses.phq4),
        risk_level: riskAssessment.level,
        recommendations: riskAssessment.recommendations,
        stress_level: responses.additional.stressLevel || 5,
        stress_sources: responses.additional.stressSources || [],
        daily_tracking_goal: responses.additional.dailyTrackingGoal || 1,
        interests: responses.additional.interests || []
      }

      const { data, error } = await dbHelpers.saveSurveyResults(user.id, surveyData)
      
      if (error) throw error

      // Update profile to mark survey as completed
      await dbHelpers.upsertProfile(user.id, {
        survey_completed: true
      })

      onSurveyComplete?.({
        surveyData,
        scores,
        riskAssessment,
        completedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Survey save error:', error)
      alert('Anket sonuçları kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  // Check if current section is complete
  const isSectionComplete = (sectionIndex) => {
    switch (sectionIndex) {
      case 0: // WHO-5
        return Object.keys(responses.who5).length === 5
      case 1: // PHQ-4
        return Object.keys(responses.phq4).length === 4
      case 2: // Additional
        return responses.additional.stressLevel && 
               responses.additional.dailyTrackingGoal
      default:
        return true
    }
  }

  // Render WHO-5 section
  const renderWHO5Section = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
          <Heart className="w-8 h-8 text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Genel İyilik Hali</h2>
        <p className="text-gray-600">
          Son iki haftada aşağıdaki durumları ne sıklıkta yaşadığınızı belirtin
        </p>
      </div>

      <div className="space-y-6">
        {surveyQuestions.who5.questions.map((question, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {question.text}
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name={`who5_${index}`}
                    value={optionIndex}
                    checked={responses.who5[index] === optionIndex}
                    onChange={(e) => handleResponseChange('who5', index, e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-center mb-1">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    ({optionIndex})
                  </span>
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    responses.who5[index] === optionIndex 
                      ? 'bg-blue-600' 
                      : 'border-2 border-gray-300'
                  }`} />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(responses.who5).length === 5 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800">
              Geçici WHO-5 skorunuz: {calculateWHO5Score()}/100
            </span>
          </div>
        </div>
      )}
    </div>
  )

  // Render PHQ-4 section
  const renderPHQ4Section = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ruh Sağlığı Taraması</h2>
        <p className="text-gray-600">
          Son iki haftada aşağıdaki sorunlar sizi ne kadar rahatsız etti?
        </p>
      </div>

      <div className="space-y-6">
        {surveyQuestions.phq4.questions.map((question, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {question.text}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors">
                  <input
                    type="radio"
                    name={`phq4_${index}`}
                    value={optionIndex}
                    checked={responses.phq4[index] === optionIndex}
                    onChange={(e) => handleResponseChange('phq4', index, e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-center mb-1">
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    ({optionIndex})
                  </span>
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    responses.phq4[index] === optionIndex 
                      ? 'bg-purple-600' 
                      : 'border-2 border-gray-300'
                  }`} />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(responses.phq4).length === 4 && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-purple-800 font-medium">Geçici Skorlarınız:</span>
            </div>
            <div className="ml-7 space-y-1 text-purple-700">
              <p>Depresyon: {calculatePHQ4Scores()?.depression || 0}/6</p>
              <p>Anksiyete: {calculatePHQ4Scores()?.anxiety || 0}/6</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Render additional questions section
  const renderAdditionalSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Activity className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ek Bilgiler</h2>
        <p className="text-gray-600">
          Sizin için daha iyi öneriler sunabilmek için birkaç soru daha
        </p>
      </div>

      <div className="space-y-6">
        {/* Stress Level */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Bugün stres seviyenizi 1-10 arası nasıl değerlendirirsiniz?
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Çok düşük</span>
            <input
              type="range"
              min="1"
              max="10"
              value={responses.additional.stressLevel || 5}
              onChange={(e) => handleAdditionalChange('stressLevel', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm text-gray-500">Çok yüksek</span>
          </div>
          <div className="mt-2 text-center">
            <span className="text-2xl font-bold text-blue-600">
              {responses.additional.stressLevel || 5}/10
            </span>
          </div>
        </div>

        {/* Stress Sources */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ana stres kaynaklarınız nelerdir? (Birden fazla seçebilirsiniz)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {surveyQuestions.additional.stressSources.map((source) => (
              <label key={source.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={(responses.additional.stressSources || []).includes(source.value)}
                  onChange={(e) => {
                    const currentSources = responses.additional.stressSources || []
                    const newSources = e.target.checked
                      ? [...currentSources, source.value]
                      : currentSources.filter(s => s !== source.value)
                    handleAdditionalChange('stressSources', newSources)
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {source.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Daily Tracking Goal */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Günde kaç kez ruh halinizi kaydetmek istersiniz?
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((goal) => (
              <label key={goal} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                <input
                  type="radio"
                  name="dailyGoal"
                  value={goal}
                  checked={responses.additional.dailyTrackingGoal === goal}
                  onChange={(e) => handleAdditionalChange('dailyTrackingGoal', parseInt(e.target.value))}
                  className="sr-only"
                />
                <span className="text-xl font-bold text-gray-900 mb-1">{goal}</span>
                <span className="text-sm text-gray-500 text-center">
                  {goal === 1 ? 'kez' : 'kez'}
                </span>
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  responses.additional.dailyTrackingGoal === goal 
                    ? 'bg-blue-600' 
                    : 'border-2 border-gray-300'
                }`} />
              </label>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            İlgi alanlarınızı seçin (Kişiselleştirilmiş öneriler için)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {surveyQuestions.additional.interests.map((interest) => (
              <label key={interest.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={(responses.additional.interests || []).includes(interest.value)}
                  onChange={(e) => {
                    const currentInterests = responses.additional.interests || []
                    const newInterests = e.target.checked
                      ? [...currentInterests, interest.value]
                      : currentInterests.filter(i => i !== interest.value)
                    handleAdditionalChange('interests', newInterests)
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {interest.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Render results section
  const renderResultsSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sonuçlarınız</h2>
        <p className="text-gray-600">
          Anket değerlendirmeniz ve kişiselleştirilmiş önerileriniz
        </p>
      </div>

      <div className="space-y-6">
        {/* Risk Level Alert */}
        {riskAssessment && (
          <div className={`p-6 rounded-lg border-l-4 ${
            riskAssessment.level === 'low' ? 'bg-green-50 border-green-400' :
            riskAssessment.level === 'moderate' ? 'bg-yellow-50 border-yellow-400' :
            riskAssessment.level === 'high' ? 'bg-orange-50 border-orange-400' :
            'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center mb-4">
              {riskAssessment.level === 'low' ? 
                <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" /> :
                <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
              }
              <h3 className={`text-lg font-medium ${
                riskAssessment.level === 'low' ? 'text-green-800' :
                riskAssessment.level === 'moderate' ? 'text-yellow-800' :
                riskAssessment.level === 'high' ? 'text-orange-800' :
                'text-red-800'
              }`}>
                {riskAssessment.level === 'low' && 'Düşük Risk - Güzel!'}
                {riskAssessment.level === 'moderate' && 'Orta Risk - Dikkat'}
                {riskAssessment.level === 'high' && 'Yüksek Risk - Önemli'}
                {riskAssessment.level === 'crisis' && 'Acil Durum - Yardım Gerekli'}
              </h3>
            </div>
            <p className={`mb-4 ${
              riskAssessment.level === 'low' ? 'text-green-700' :
              riskAssessment.level === 'moderate' ? 'text-yellow-700' :
              riskAssessment.level === 'high' ? 'text-orange-700' :
              'text-red-700'
            }`}>
              {riskAssessment.level === 'low' && 
                'Genel ruh sağlığınız iyi görünüyor. Mevcut rutininizi sürdürmeye devam edin.'
              }
              {riskAssessment.level === 'moderate' && 
                'Bazı alanlarda iyileştirme fırsatları var. Önerilerimizi gözden geçirin.'
              }
              {riskAssessment.level === 'high' && 
                'Profesyonel destek almanız faydalı olabilir. Önerilerimizi dikkate alın.'
              }
              {riskAssessment.level === 'crisis' && 
                'Acil profesyonel yardım almanız önemle tavsiye edilir.'
              }
            </p>
            
            {riskAssessment.level === 'crisis' && (
              <div className="bg-red-100 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-red-800 mb-2">Acil Yardım Hatları:</h4>
                <ul className="text-red-700 space-y-1">
                  <li>🆘 Acil Durum: 112</li>
                  <li>💙 Yaşam Hattı: 183</li>
                  <li>🧠 Ruh Sağlığı Merkezi: 444 0 183</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Detailed Scores */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">WHO-5 İyilik Hali</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Skorunuz:</span>
                <span className="text-2xl font-bold text-pink-600">{scores.who5Score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-pink-600 h-3 rounded-full" 
                  style={{ width: `${scores.who5Score}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {scores.who5Score > 50 ? 'İyi seviyede iyilik hali' : 
                 scores.who5Score > 28 ? 'Geliştirilmesi gereken alanlar var' :
                 'Profesyonel destek önerilir'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">PHQ-4 Ruh Sağlığı</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600">Depresyon:</span>
                  <span className="font-bold text-purple-600">{scores.phq4Scores?.depression}/6</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(scores.phq4Scores?.depression || 0) / 6 * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600">Anksiyete:</span>
                  <span className="font-bold text-purple-600">{scores.phq4Scores?.anxiety}/6</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(scores.phq4Scores?.anxiety || 0) / 6 * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {riskAssessment?.recommendations && riskAssessment.recommendations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Kişiselleştirilmiş Öneriler</h3>
            <ul className="space-y-2">
              {riskAssessment.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personal Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kişisel Özet</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Stres seviyesi:</span>
              <span className="ml-2 font-medium">{responses.additional.stressLevel}/10</span>
            </div>
            <div>
              <span className="text-gray-600">Günlük hedef:</span>
              <span className="ml-2 font-medium">{responses.additional.dailyTrackingGoal} kayıt/gün</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600">Seçtiğiniz stres kaynakları:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {(responses.additional.stressSources || []).map((source) => (
                  <span key={source} className="px-2 py-1 bg-gray-200 rounded text-xs">
                    {surveyQuestions.additional.stressSources.find(s => s.value === source)?.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Önemli Not</h4>
              <p className="text-amber-700 text-sm">
                Bu değerlendirme yalnızca bilgilendirme amaçlıdır ve tıbbi teşhis yerine geçmez. 
                Ruh sağlığınızla ilgili endişeleriniz varsa, mutlaka profesyonel yardım alın.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSaveSurvey}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : 'Sonuçları Kaydet ve Devam Et'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {sections.map((section, index) => (
              <div key={section.key} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentSection 
                    ? 'bg-green-600 text-white' 
                    : index === currentSection 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentSection ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    React.createElement(section.icon, { className: "w-5 h-5" })
                  )}
                </div>
                {index < sections.length - 1 && (
                  <div className={`w-16 h-0.5 ml-4 ${index < currentSection ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
            {/* Results step */}
            <div className="flex items-center">
              <div className={`w-16 h-0.5 ${currentSection >= sections.length ? 'bg-green-600' : 'bg-gray-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ml-4 ${
                currentSection >= sections.length 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <span className="text-sm text-gray-500">
              {currentSection < sections.length 
                ? `${sections[currentSection].title} - Adım ${currentSection + 1}/${sections.length + 1}`
                : `Sonuçlar - Adım ${sections.length + 1}/${sections.length + 1}`
              }
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentSection === 0 && renderWHO5Section()}
          {currentSection === 1 && renderPHQ4Section()}
          {currentSection === 2 && renderAdditionalSection()}
          {currentSection === 3 && renderResultsSection()}
        </div>

        {/* Navigation */}
        {currentSection < 3 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="flex items-center px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentSection === 0 ? 'Ana Sayfaya Dön' : 'Önceki'}
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isSectionComplete(currentSection)}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentSection === 2 ? 'Sonuçları Gör' : 'Devam Et'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SurveyComponent