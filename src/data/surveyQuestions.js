// EMOTICE - Global Mental Health Assessment Survey
// Based on internationally validated mental health screening tools

export const surveyQuestions = {
  // Basic demographic and setup questions
  demographics: {
    title: "About You",
    description: "Help us personalize your Emotice experience",
    questions: [
      {
        id: "age_group",
        type: "select",
        question: "What's your age group?",
        required: false,
        options: [
          { value: "16-18", label: "16-18 years" },
          { value: "19-25", label: "19-25 years" },
          { value: "26-35", label: "26-35 years" },
          { value: "36-45", label: "36-45 years" },
          { value: "46-55", label: "46-55 years" },
          { value: "56-65", label: "56-65 years" },
          { value: "65+", label: "65+ years" }
        ]
      },
      {
        id: "gender",
        type: "select",
        question: "How do you identify? (Optional)",
        required: false,
        options: [
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
          { value: "non-binary", label: "Non-binary" },
          { value: "other", label: "Other" },
          { value: "prefer-not-to-say", label: "Prefer not to say" }
        ]
      },
      {
        id: "country",
        type: "select",
        question: "Which country are you in?",
        required: true,
        options: [
          { value: "US", label: "United States" },
          { value: "GB", label: "United Kingdom" },
          { value: "CA", label: "Canada" },
          { value: "AU", label: "Australia" },
          { value: "DE", label: "Germany" },
          { value: "FR", label: "France" },
          { value: "ES", label: "Spain" },
          { value: "IT", label: "Italy" },
          { value: "NL", label: "Netherlands" },
          { value: "SE", label: "Sweden" },
          { value: "NO", label: "Norway" },
          { value: "DK", label: "Denmark" },
          { value: "FI", label: "Finland" },
          { value: "other", label: "Other" }
        ]
      }
    ]
  },

  // WHO-5 Well-being Index (Internationally validated)
  wellbeing: {
    title: "General Well-being",
    description: "These questions are about how you have been feeling over the past two weeks.",
    instruction: "Please rate each statement on how often it applied to you over the past 2 weeks:",
    scale: {
      type: "likert",
      min: 0,
      max: 5,
      labels: {
        0: "Never",
        1: "Rarely", 
        2: "Sometimes",
        3: "Often",
        4: "Very often",
        5: "Always"
      }
    },
    questions: [
      {
        id: "who5_1",
        question: "I have felt cheerful and in good spirits",
        reverse_scored: false
      },
      {
        id: "who5_2", 
        question: "I have felt calm and relaxed",
        reverse_scored: false
      },
      {
        id: "who5_3",
        question: "I have felt active and vigorous",
        reverse_scored: false
      },
      {
        id: "who5_4",
        question: "I woke up feeling fresh and rested",
        reverse_scored: false
      },
      {
        id: "who5_5",
        question: "My daily life has been filled with things that interest me",
        reverse_scored: false
      }
    ],
    scoring: {
      total_max: 25,
      interpretation: {
        "0-12": "Poor well-being - Consider seeking professional support",
        "13-17": "Below average well-being",  
        "18-25": "Good well-being"
      }
    }
  },

  // PHQ-4 (Brief screening for depression and anxiety)
  mentalHealth: {
    title: "Mental Health Screening",
    description: "Over the past 2 weeks, how often have you been bothered by the following problems?",
    instruction: "This brief screening helps us understand your current mental health status:",
    scale: {
      type: "likert",
      min: 0,
      max: 3,
      labels: {
        0: "Not at all",
        1: "Several days",
        2: "More than half the days", 
        3: "Nearly every day"
      }
    },
    questions: [
      // PHQ-2 (Depression screening)
      {
        id: "phq2_1",
        question: "Little interest or pleasure in doing things",
        category: "depression"
      },
      {
        id: "phq2_2",
        question: "Feeling down, depressed, or hopeless", 
        category: "depression"
      },
      // GAD-2 (Anxiety screening)
      {
        id: "gad2_1", 
        question: "Feeling nervous, anxious, or on edge",
        category: "anxiety"
      },
      {
        id: "gad2_2",
        question: "Not being able to stop or control worrying",
        category: "anxiety"
      }
    ],
    scoring: {
      depression_cutoff: 3,
      anxiety_cutoff: 3,
      interpretation: {
        depression: {
          "0-2": "Minimal depression symptoms",
          "3-6": "Mild to moderate depression symptoms - consider professional evaluation"
        },
        anxiety: {
          "0-2": "Minimal anxiety symptoms", 
          "3-6": "Mild to moderate anxiety symptoms - consider professional evaluation"
        }
      }
    },
    followUp: {
      condition: "score >= 3",
      message: "Based on your responses, you may benefit from speaking with a mental health professional. Would you like resources for finding support in your area?"
    }
  },

  // Sleep and lifestyle factors
  lifestyle: {
    title: "Lifestyle & Habits",
    description: "These factors can significantly impact your mental well-being:",
    questions: [
      {
        id: "sleep_quality",
        type: "scale",
        question: "How would you rate your sleep quality over the past week?",
        scale: {
          min: 1,
          max: 10,
          labels: {
            1: "Very poor",
            10: "Excellent"
          }
        },
        required: true
      },
      {
        id: "sleep_hours",
        type: "select",
        question: "On average, how many hours of sleep do you get per night?",
        required: true,
        options: [
          { value: "<4", label: "Less than 4 hours" },
          { value: "4-5", label: "4-5 hours" },
          { value: "6-7", label: "6-7 hours" },
          { value: "7-8", label: "7-8 hours" },
          { value: "8-9", label: "8-9 hours" },
          { value: ">9", label: "More than 9 hours" }
        ]
      },
      {
        id: "exercise_frequency",
        type: "select", 
        question: "How often do you engage in physical exercise or activity?",
        required: true,
        options: [
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely (less than once a week)" },
          { value: "sometimes", label: "Sometimes (1-2 times a week)" },
          { value: "regularly", label: "Regularly (3-4 times a week)" },
          { value: "daily", label: "Daily or almost daily" }
        ]
      },
      {
        id: "stress_level",
        type: "scale", 
        question: "What's your current stress level on average?",
        scale: {
          min: 1,
          max: 10,
          labels: {
            1: "No stress",
            10: "Extremely stressed"
          }
        },
        required: true
      }
    ]
  },

  // Support system and coping
  support: {
    title: "Support & Coping",
    description: "Understanding your support system helps us provide better recommendations:",
    questions: [
      {
        id: "social_support",
        type: "select",
        question: "How would you describe your current social support system?",
        required: true,
        options: [
          { value: "strong", label: "Strong - I have people I can rely on" },
          { value: "moderate", label: "Moderate - I have some support" },
          { value: "limited", label: "Limited - I have few people to turn to" },
          { value: "minimal", label: "Minimal - I feel isolated" }
        ]
      },
      {
        id: "professional_help",
        type: "select",
        question: "Are you currently receiving professional mental health support?",
        required: false,
        options: [
          { value: "therapy", label: "Yes, therapy/counseling" },
          { value: "medication", label: "Yes, medication" },
          { value: "both", label: "Yes, both therapy and medication" },
          { value: "no", label: "No, not currently" },
          { value: "considering", label: "No, but considering it" }
        ]
      },
      {
        id: "coping_strategies",
        type: "multiple_select",
        question: "What coping strategies do you currently use? (Select all that apply)",
        required: false,
        options: [
          { value: "exercise", label: "Exercise/Physical activity" },
          { value: "meditation", label: "Meditation/Mindfulness" },
          { value: "journaling", label: "Journaling/Writing" },
          { value: "music", label: "Music/Arts" },
          { value: "socializing", label: "Talking with friends/family" },
          { value: "hobbies", label: "Hobbies/Creative activities" },
          { value: "nature", label: "Spending time in nature" },
          { value: "reading", label: "Reading" },
          { value: "other", label: "Other" }
        ]
      }
    ]
  },

  // Goals and expectations
  goals: {
    title: "Your Goals with Emotice", 
    description: "Help us tailor your experience to your needs:",
    questions: [
      {
        id: "primary_goal",
        type: "select",
        question: "What's your primary goal in using Emotice?",
        required: true,
        options: [
          { value: "track_mood", label: "Track and understand my mood patterns" },
          { value: "improve_awareness", label: "Improve self-awareness and mindfulness" },
          { value: "manage_stress", label: "Manage stress and anxiety" },
          { value: "build_habits", label: "Build healthy mental wellness habits" },
          { value: "supplement_therapy", label: "Supplement professional therapy" },
          { value: "prevention", label: "Maintain good mental health (prevention)" },
          { value: "other", label: "Other" }
        ]
      },
      {
        id: "tracking_frequency",
        type: "select",
        question: "How often would you like to track your mood?",
        required: true,
        options: [
          { value: "daily", label: "Daily" },
          { value: "few_times_week", label: "A few times per week" },
          { value: "weekly", label: "Weekly" },
          { value: "as_needed", label: "Only when I feel I need to" }
        ]
      },
      {
        id: "notification_preference",
        type: "select",
        question: "Would you like gentle reminders to check in with your mood?",
        required: true,
        options: [
          { value: "daily", label: "Yes, daily reminders" },
          { value: "few_times_week", label: "Yes, a few times per week" },
          { value: "weekly", label: "Yes, weekly reminders" },
          { value: "no", label: "No, I'll check in on my own" }
        ]
      }
    ]
  }
}

// Scoring algorithms
export const scoringAlgorithms = {
  calculateWHO5Score: (responses) => {
    const who5Questions = ['who5_1', 'who5_2', 'who5_3', 'who5_4', 'who5_5']
    const total = who5Questions.reduce((sum, q) => sum + (responses[q] || 0), 0)
    const percentage = (total / 25) * 100
    
    return {
      raw_score: total,
      percentage: percentage,
      interpretation: percentage < 52 ? "low_wellbeing" : "good_wellbeing",
      recommendation: percentage < 52 ? "Consider seeking professional support for your well-being" : "You're showing good well-being indicators"
    }
  },

  calculatePHQ4Score: (responses) => {
    const depressionScore = (responses.phq2_1 || 0) + (responses.phq2_2 || 0)
    const anxietyScore = (responses.gad2_1 || 0) + (responses.gad2_2 || 0)
    
    return {
      depression: {
        score: depressionScore,
        severity: depressionScore >= 3 ? "mild_moderate" : "minimal",
        recommendation: depressionScore >= 3 ? "Consider discussing these feelings with a healthcare provider" : "Minimal depression symptoms"
      },
      anxiety: {
        score: anxietyScore, 
        severity: anxietyScore >= 3 ? "mild_moderate" : "minimal",
        recommendation: anxietyScore >= 3 ? "Consider discussing these concerns with a healthcare provider" : "Minimal anxiety symptoms"
      }
    }
  },

  generateRecommendations: (responses, scores) => {
    const recommendations = []
    
    // Based on WHO-5 score
    if (scores.wellbeing && scores.wellbeing.percentage < 52) {
      recommendations.push({
        type: "professional_support",
        priority: "high",
        message: "Your well-being score suggests you might benefit from professional mental health support.",
        action: "Consider reaching out to a counselor, therapist, or your healthcare provider."
      })
    }
    
    // Based on PHQ-4 scores
    if (scores.mental_health && (scores.mental_health.depression.score >= 3 || scores.mental_health.anxiety.score >= 3)) {
      recommendations.push({
        type: "professional_evaluation", 
        priority: "high",
        message: "Your responses suggest symptoms that may benefit from professional evaluation.",
        action: "Consider scheduling an appointment with a mental health professional."
      })
    }
    
    // Based on lifestyle factors
    if (responses.sleep_quality <= 4) {
      recommendations.push({
        type: "sleep_hygiene",
        priority: "medium",
        message: "Poor sleep quality can significantly impact mental health.",
        action: "Consider implementing a consistent sleep routine and discussing sleep concerns with a healthcare provider."
      })
    }
    
    if (responses.stress_level >= 7) {
      recommendations.push({
        type: "stress_management",
        priority: "medium", 
        message: "High stress levels can impact your overall well-being.",
        action: "Consider stress reduction techniques like mindfulness, exercise, or speaking with a counselor."
      })
    }
    
    // Based on social support
    if (responses.social_support === "minimal" || responses.social_support === "limited") {
      recommendations.push({
        type: "social_connection",
        priority: "medium",
        message: "Social support is crucial for mental well-being.",
        action: "Consider joining support groups, community activities, or connecting with existing relationships."
      })
    }
    
    return recommendations
  }
}

// Crisis intervention triggers
export const crisisIndicators = {
  checkForCrisisIndicators: (responses, scores) => {
    const crisisFlags = []
    
    // Very low well-being combined with high depression/anxiety scores
    if (scores.wellbeing && scores.mental_health && 
        scores.wellbeing.percentage < 28 && 
        (scores.mental_health.depression.score >= 5 || scores.mental_health.anxiety.score >= 5)) {
      crisisFlags.push("severe_distress")
    }
    
    // Minimal social support + high distress
    if (responses.social_support === "minimal" && responses.stress_level >= 8) {
      crisisFlags.push("isolation_stress")
    }
    
    return crisisFlags.length > 0 ? {
      crisis_detected: true,
      flags: crisisFlags,
      message: "Your responses indicate you may be experiencing significant distress. Please consider reaching out for immediate support.",
      resources: "crisis_resources"
    } : {
      crisis_detected: false
    }
  }
}

export default surveyQuestions