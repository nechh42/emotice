// src/services/consent/consentService.js
// EMOTICE Consent Service - Legal compliance management
// TALÄ°MAT #13, #14, #15 compliance

import { supabase } from '../../lib/supabase'

export class ConsentService {
  // Store user consents in database
  async saveUserConsents(userId, consents, userAgent = null) {
    try {
      const consentRecord = {
        user_id: userId,
        consent_version: '1.0',
        consent_date: new Date().toISOString(),
        ip_address: null, // Will be captured by Supabase if configured
        user_agent: userAgent || navigator?.userAgent,
        consents: {
          terms_of_service: {
            granted: consents.termsOfService,
            timestamp: new Date().toISOString(),
            version: '1.0'
          },
          privacy_policy: {
            granted: consents.privacyPolicy,
            timestamp: new Date().toISOString(),
            version: '1.0'
          },
          medical_disclaimer: {
            granted: consents.medicalDisclaimer,
            timestamp: new Date().toISOString(),
            version: '1.0'
          },
          age_verification: {
            granted: consents.ageVerification,
            timestamp: new Date().toISOString(),
            user_claimed_age: consents.userAge || null
          },
          parental_consent: {
            granted: consents.parentalConsent || null,
            timestamp: consents.parentalConsent ? new Date().toISOString() : null,
            required: consents.userAge >= 16 && consents.userAge < 18
          },
          data_processing: {
            granted: consents.dataProcessing,
            timestamp: new Date().toISOString(),
            granular_consents: {
              essential_data: true, // Always required
              analytics_data: consents['analytics-data'] || false,
              marketing_data: consents['marketing-data'] || false
            }
          },
          survey_completion_agreement: {
            granted: consents.surveyCompletion,
            timestamp: new Date().toISOString(),
            completed: false // Will be updated when survey is actually completed
          }
        },
        compliance_flags: {
          gdpr_compliant: true,
          ccpa_compliant: true,
          coppa_compliant: consents.userAge >= 16,
          all_required_consents: this.validateRequiredConsents(consents)
        }
      }

      const { data, error } = await supabase
        .from('user_consents')
        .insert([consentRecord])
        .select()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error saving consents:', error)
      return { success: false, error: error.message }
    }
  }

  // Validate all required consents are given
  validateRequiredConsents(consents) {
    const required = [
      'termsOfService',
      'privacyPolicy',
      'medicalDisclaimer',
      'ageVerification',
      'dataProcessing',
      'surveyCompletion'
    ]

    // Add parental consent for minors
    if (consents.userAge >= 16 && consents.userAge < 18) {
      required.push('parentalConsent')
    }

    return required.every(consent => consents[consent] === true)
  }

  // Check if user has valid consents
  async getUserConsents(userId) {
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', userId)
        .order('consent_date', { ascending: false })
        .limit(1)

      if (error) throw error

      return { success: true, data: data[0] || null }
    } catch (error) {
      console.error('Error fetching consents:', error)
      return { success: false, error: error.message }
    }
  }

  // Update survey completion status
  async markSurveyCompleted(userId, surveyData) {
    try {
      // Get current consent record
      const consentResult = await this.getUserConsents(userId)
      if (!consentResult.success || !consentResult.data) {
        throw new Error('No consent record found')
      }

      const updatedConsents = {
        ...consentResult.data.consents,
        survey_completion_agreement: {
          ...consentResult.data.consents.survey_completion_agreement,
          completed: true,
          completed_date: new Date().toISOString(),
          survey_data_summary: {
            who5_score: surveyData.who5?.total_score,
            phq4_score: surveyData.phq4?.total_score,
            risk_level: surveyData.risk_assessment?.level,
            completed_sections: Object.keys(surveyData)
          }
        }
      }

      const { data, error } = await supabase
        .from('user_consents')
        .update({ 
          consents: updatedConsents,
          survey_completed_date: new Date().toISOString()
        })
        .eq('id', consentResult.data.id)
        .select()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error updating survey completion:', error)
      return { success: false, error: error.message }
    }
  }

  // Check if user needs to re-consent (version updates, etc.)
  async needsReConsent(userId) {
    try {
      const result = await this.getUserConsents(userId)
      if (!result.success) return { needsConsent: true, reason: 'No consent record' }

      const consent = result.data
      if (!consent) return { needsConsent: true, reason: 'No consent record' }

      // Check version compatibility
      const currentVersion = '1.0'
      if (consent.consent_version !== currentVersion) {
        return { needsConsent: true, reason: 'Version update' }
      }

      // Check if all required consents are still valid
      if (!consent.compliance_flags?.all_required_consents) {
        return { needsConsent: true, reason: 'Missing required consents' }
      }

      // Check if survey is completed (TALÄ°MAT #14)
      if (!consent.consents?.survey_completion_agreement?.completed) {
        return { needsConsent: true, reason: 'Survey not completed' }
      }

      return { needsConsent: false }
    } catch (error) {
      console.error('Error checking consent status:', error)
      return { needsConsent: true, reason: 'Error checking consent' }
    }
  }

  // Withdraw consent (GDPR right to withdraw)
  async withdrawConsent(userId, consentType) {
    try {
      const result = await this.getUserConsents(userId)
      if (!result.success || !result.data) {
        throw new Error('No consent record found')
      }

      const updatedConsents = {
        ...result.data.consents,
        [consentType]: {
          ...result.data.consents[consentType],
          granted: false,
          withdrawn_date: new Date().toISOString(),
          withdrawn: true
        }
      }

      const { data, error } = await supabase
        .from('user_consents')
        .update({ consents: updatedConsents })
        .eq('id', result.data.id)
        .select()

      if (error) throw error

      // If essential consents are withdrawn, mark account for deletion
      const essentialConsents = ['terms_of_service', 'privacy_policy', 'data_processing']
      if (essentialConsents.includes(consentType)) {
        await this.scheduleAccountDeletion(userId)
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error withdrawing consent:', error)
      return { success: false, error: error.message }
    }
  }

  // Schedule account deletion for withdrawn essential consents
  async scheduleAccountDeletion(userId) {
    try {
      const deletionDate = new Date()
      deletionDate.setDate(deletionDate.getDate() + 30) // 30-day grace period

      const { data, error } = await supabase
        .from('account_deletion_schedule')
        .insert([{
          user_id: userId,
          scheduled_deletion_date: deletionDate.toISOString(),
          reason: 'Essential consent withdrawn',
          status: 'scheduled'
        }])

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error scheduling account deletion:', error)
      return { success: false, error: error.message }
    }
  }

  // Get consent history for transparency
  async getConsentHistory(userId) {
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', userId)
        .order('consent_date', { ascending: false })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching consent history:', error)
      return { success: false, error: error.message }
    }
  }

  // Generate consent report for data portability (GDPR)
  async generateConsentReport(userId) {
    try {
      const result = await this.getConsentHistory(userId)
      if (!result.success) throw new Error('Failed to fetch consent history')

      const report = {
        user_id: userId,
        report_generated_date: new Date().toISOString(),
        consent_history: result.data,
        current_status: result.data[0] || null,
        data_processing_purposes: [
          'Account management and authentication',
          'Mood tracking and mental health assessments', 
          'Personalized recommendations and insights',
          'Service improvement and analytics (if consented)',
          'Marketing communications (if consented)'
        ],
        user_rights: [
          'Right to access your data',
          'Right to rectify incorrect data',
          'Right to erasure (deletion)',
          'Right to restrict processing',
          'Right to data portability',
          'Right to object to processing',
          'Right to withdraw consent'
        ],
        contact_information: {
          privacy_email: 'privacy@emotice.com',
          data_protection_officer: 'dpo@emotice.com'
        }
      }

      return { success: true, data: report }
    } catch (error) {
      console.error('Error generating consent report:', error)
      return { success: false, error: error.message }
    }
  }

  // Validate age (TALÄ°MAT #15)
  validateAge(birthDate) {
    const today = new Date()
    const birth = new Date(birthDate)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return {
      age,
      isValidAge: age >= 16,
      isMinor: age >= 16 && age < 18,
      requiresParentalConsent: age >= 16 && age < 18
    }
  }

  // Create database tables (run this once during setup)
  async createConsentTables() {
    try {
      // This would be run as part of database migration
      const createUserConsentsTable = `
        CREATE TABLE IF NOT EXISTS user_consents (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          consent_version TEXT NOT NULL DEFAULT '1.0',
          consent_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          survey_completed_date TIMESTAMPTZ,
          ip_address INET,
          user_agent TEXT,
          consents JSONB NOT NULL,
          compliance_flags JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS account_deletion_schedule (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          scheduled_deletion_date TIMESTAMPTZ NOT NULL,
          reason TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'scheduled',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_consents_consent_date ON user_consents(consent_date DESC);
        CREATE INDEX IF NOT EXISTS idx_deletion_schedule_user_id ON account_deletion_schedule(user_id);
        CREATE INDEX IF NOT EXISTS idx_deletion_schedule_date ON account_deletion_schedule(scheduled_deletion_date);
      `

      console.log('Consent tables SQL:', createUserConsentsTable)
      return { success: true, sql: createUserConsentsTable }
    } catch (error) {
      console.error('Error creating consent tables:', error)
      return { success: false, error: error.message }
    }
  }
}

export const consentService = new ConsentService()
