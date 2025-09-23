// src/data/legal/privacyPolicyContent.js
// EMOTICE Global Privacy Policy - GDPR, CCPA, LGPD, PIPEDA Uyumlu
// Mental Health App Privacy Policy

export const privacyPolicyContent = {
  lastUpdated: "2025-01-20",
  version: "1.0",
  
  // Multi-language support ready
  languages: {
    en: {
      title: "Privacy Policy",
      sections: {
        introduction: {
          title: "Introduction",
          content: `
Welcome to EMOTICE, a mental health and wellness application designed to help you track your mood, manage stress, and improve your emotional well-being. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services.

We are committed to protecting your privacy and maintaining the security of your personal information, especially given the sensitive nature of mental health data. This policy complies with major international privacy laws including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), Lei Geral de Proteção de Dados (LGPD), and other applicable privacy regulations.

By using EMOTICE, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our services.
          `
        },
        
        dataController: {
          title: "Data Controller Information",
          content: `
Data Controller: EMOTICE Inc.
Email: privacy@emotice.com
Address: [To be updated based on business registration]
Data Protection Officer: dpo@emotice.com

For users in the European Union, we act as the data controller for your personal information. For users in other jurisdictions, we process your data in accordance with applicable local privacy laws.
          `
        },
        
        dataCollection: {
          title: "Information We Collect",
          content: `
We collect information you provide directly to us and information automatically collected through your use of our services:

**Personal Information:**
- Account registration data (name, email address, date of birth, gender)
- Profile information (avatar, preferences, settings)
- Contact information for customer support

**Sensitive Health Data (Special Category Data under GDPR):**
- Mood tracking entries and scores
- Mental health assessment responses (WHO-5, PHQ-4, GAD-7, etc.)
- Personal notes and journal entries
- Wellness goals and progress tracking
- Sleep patterns and exercise data (if provided)

**Technical Information:**
- Device information (device type, operating system, unique device identifiers)
- Usage analytics (feature usage, session duration, app performance)
- Location data (general location for regional content, not precise location)
- Cookies and similar technologies data

**Payment Information:**
- Billing information for premium subscriptions
- Payment transaction data (processed securely through third-party payment processors)

We do not collect more information than necessary for the purposes outlined in this policy, adhering to the principle of data minimization.
          `
        },
        
        legalBasis: {
          title: "Legal Basis for Processing (GDPR)",
          content: `
We process your personal data based on the following legal grounds:

**Consent:** For processing sensitive health data, marketing communications, and optional features. You may withdraw consent at any time.

**Contractual Necessity:** To provide our core services, manage your account, and fulfill our terms of service.

**Legitimate Interests:** For analytics, fraud prevention, customer support, and service improvement, balanced against your privacy rights.

**Legal Obligations:** To comply with applicable laws, regulations, and legal requests.

**Vital Interests:** In emergency situations where your wellbeing may be at risk.
          `
        },
        
        dataUse: {
          title: "How We Use Your Information",
          content: `
We use your information for the following purposes:

**Core Services:**
- Provide mood tracking and mental health features
- Generate personalized insights and recommendations
- Deliver motivational content and wellness tips
- Process premium subscription features
- Enable social features (if applicable)

**Service Improvement:**
- Analyze usage patterns to improve our app
- Conduct research for feature development
- Perform quality assurance and testing
- Ensure app security and prevent fraud

**Communications:**
- Send service-related notifications
- Provide customer support
- Share educational mental health content (with consent)
- Send promotional offers for premium features (with consent)

**Legal and Safety:**
- Comply with legal obligations
- Protect users' safety and wellbeing
- Enforce our terms of service
- Respond to legal requests

We do not use your mental health data for advertising purposes or sell it to third parties.
          `
        },
        
        dataSharing: {
          title: "Information Sharing and Disclosure",
          content: `
We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:

**Service Providers:** We work with trusted third-party service providers who assist in operating our app, processing payments, providing analytics, and delivering customer support. These providers are contractually bound to protect your information and use it only for the specified purposes.

**Healthcare Providers:** With your explicit consent, we may share relevant health information with licensed healthcare professionals you choose to connect with through our platform.

**Legal Requirements:** We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.

**Business Transfers:** In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to the same privacy protections.

**Emergency Situations:** If we believe you are at immediate risk of harm to yourself or others, we may share necessary information with emergency services or mental health crisis intervention services.

**Anonymized Data:** We may share anonymized, aggregated data that cannot identify you for research, analytics, or business development purposes.

All data sharing complies with applicable privacy laws and is subject to appropriate safeguards.
          `
        },
        
        dataRetention: {
          title: "Data Retention",
          content: `
We retain your information for as long as necessary to fulfill the purposes outlined in this policy:

**Account Data:** Retained while your account is active and for 30 days after deletion to allow for account recovery.

**Health Data:** Mood entries and assessments are retained for up to 7 years to provide historical insights, or until you request deletion, whichever comes first.

**Support Communications:** Customer service records are kept for 3 years for quality assurance and legal compliance.

**Legal Compliance:** Some data may be retained longer if required by applicable laws or for legitimate legal purposes.

**Anonymized Data:** May be retained indefinitely for research and analytics purposes.

You can request deletion of your data at any time through your account settings or by contacting us. We will comply with deletion requests within 30 days, subject to legal requirements.
          `
        },
        
        userRights: {
          title: "Your Privacy Rights",
          content: `
Depending on your location, you have the following rights:

**GDPR Rights (EU/UK/EEA Users):**
- Right to access your personal data
- Right to rectify inaccurate information
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing
- Right to withdraw consent
- Right not to be subject to automated decision-making

**CCPA Rights (California Residents):**
- Right to know what personal information is collected
- Right to know if personal information is sold or disclosed
- Right to opt-out of the sale of personal information
- Right to delete personal information
- Right to equal services and pricing

**LGPD Rights (Brazil Residents):**
- Right to access, correct, and delete personal data
- Right to data portability
- Right to information about data sharing
- Right to withdraw consent

**How to Exercise Your Rights:**
- Through your account settings for most requests
- Email us at privacy@emotice.com
- Use our data request form at emotice.com/privacy-requests

We will respond to valid requests within 30 days (GDPR) or 45 days (CCPA).
          `
        },
        
        security: {
          title: "Data Security",
          content: `
We implement comprehensive security measures to protect your information:

**Technical Safeguards:**
- End-to-end encryption for sensitive health data
- Secure HTTPS connections for all data transmission
- Regular security audits and penetration testing
- Multi-factor authentication for account access
- Automated backup systems with encryption

**Administrative Safeguards:**
- Staff training on privacy and security
- Background checks for employees with data access
- Regular privacy impact assessments
- Incident response procedures
- Data breach notification protocols

**Physical Safeguards:**
- Secure data centers with restricted access
- Environmental controls and monitoring
- Secure disposal of physical media

Despite these measures, no system is 100% secure. We continuously monitor and improve our security practices to protect your information.
          `
        },
        
        internationalTransfers: {
          title: "International Data Transfers",
          content: `
Your information may be transferred to and processed in countries other than your country of residence, including the United States and other countries where our service providers operate.

**Safeguards for International Transfers:**
- Standard Contractual Clauses approved by the European Commission
- Adequacy decisions for countries with equivalent protection
- Additional security measures and contractual protections
- Regular compliance audits

We ensure that all international transfers comply with applicable data protection laws and provide adequate protection for your personal information.
          `
        },
        
        cookies: {
          title: "Cookies and Tracking Technologies",
          content: `
We use cookies and similar technologies to enhance your experience:

**Essential Cookies:** Required for basic app functionality and security.

**Analytics Cookies:** Help us understand how you use our app to improve performance.

**Preference Cookies:** Remember your settings and preferences.

**Marketing Cookies:** With your consent, used to show relevant content and measure campaign effectiveness.

You can control cookies through your device settings and our cookie preferences center. Essential cookies cannot be disabled without affecting app functionality.
          `
        },
        
        childrenPrivacy: {
          title: "Children's Privacy",
          content: `
EMOTICE is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have inadvertently collected personal information from a child under 16, we will delete such information immediately.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at privacy@emotice.com.
          `
        },
        
        thirdPartyServices: {
          title: "Third-Party Services",
          content: `
Our app may contain links to third-party websites, services, or integrations. This privacy policy does not apply to third-party services. We encourage you to review the privacy policies of any third-party services you interact with.

**Third-Party Integrations May Include:**
- Payment processors (Stripe, PayPal)
- Analytics services (Google Analytics)
- Customer support platforms
- Cloud storage providers

We carefully vet all third-party partners and require them to maintain appropriate privacy and security standards.
          `
        },
        
        updates: {
          title: "Changes to This Privacy Policy",
          content: `
We may update this privacy policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. 

**How We Notify You of Changes:**
- In-app notifications for significant changes
- Email notifications to registered users
- Updates posted on our website
- Version history maintained for transparency

**Effective Date:** Changes become effective immediately upon posting, unless otherwise stated. Your continued use of EMOTICE after changes are posted constitutes acceptance of the updated policy.

We encourage you to review this policy regularly to stay informed about how we protect your information.
          `
        },
        
        contact: {
          title: "Contact Information",
          content: `
If you have questions, concerns, or requests regarding this privacy policy or our privacy practices, please contact us:

**General Privacy Inquiries:**
Email: privacy@emotice.com
Response Time: Within 48 hours

**Data Protection Officer:**
Email: dpo@emotice.com
For GDPR-related inquiries

**Regional Representatives:**
- EU Representative: [To be appointed]
- UK Representative: [To be appointed]

**Postal Address:**
EMOTICE Inc.
[Address to be updated]

**Regulatory Complaints:**
You have the right to lodge a complaint with your local data protection authority if you believe we have not addressed your privacy concerns adequately.

**Emergency Contact:**
If you are in a mental health crisis, please contact emergency services immediately or call your local crisis helpline.
          `
        }
      }
    }
  }
};

export default privacyPolicyContent;