// EMOTICE - Shopier Payment Service
import axios from 'axios'
import { supabase } from '../lib/supabase'

const SHOPIER_API_KEY = import.meta.env.VITE_SHOPIER_API_KEY
const SHOPIER_STORE_ID = import.meta.env.VITE_SHOPIER_STORE_ID

if (!SHOPIER_API_KEY || !SHOPIER_STORE_ID) {
  console.error('Missing Shopier environment variables')
}

export const paymentService = {
  // Create payment link for premium subscription
  createPaymentLink: async (planType, userInfo) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Plan pricing
      const plans = {
        premium_monthly: {
          price: 29.99,
          name: 'Emotice Premium - AylÄ±k',
          description: 'Premium Ã¶zellikler, sÄ±nÄ±rsÄ±z mood tracking, fal, astroloji ve daha fazlasÄ±'
        },
        premium_yearly: {
          price: 299.99,
          name: 'Emotice Premium - YÄ±llÄ±k',
          description: 'Premium Ã¶zellikler, sÄ±nÄ±rsÄ±z mood tracking, fal, astroloji ve daha fazlasÄ± (2 ay bedava)'
        }
      }

      const selectedPlan = plans[planType]
      if (!selectedPlan) {
        throw new Error('Invalid plan type')
      }

      // Generate unique order ID
      const orderId = `EMO_${user.id.substring(0, 8)}_${Date.now()}`

      // Create payment data for Shopier
      const paymentData = {
        // Shopier API parameters
        API_key: SHOPIER_API_KEY,
        website_index: SHOPIER_STORE_ID,
        platform_order_id: orderId,
        product_name: selectedPlan.name,
        product_type: 1, // Digital product
        total_order_value: selectedPlan.price,
        currency: 'TRY',
        
        // Buyer information
        buyer_name: userInfo.fullName || user.user_metadata?.full_name || 'Emotice User',
        buyer_surname: '',
        buyer_email: userInfo.email || user.email,
        buyer_phone: userInfo.phone || '5555555555',
        buyer_account_age: '30', // Default value
        buyer_id_nr: user.id.substring(0, 16),

        // Address information (required by Shopier)
        billing_address: userInfo.address || 'Turkey',
        billing_city: userInfo.city || 'Istanbul',
        billing_country: 'Turkey',
        billing_postcode: userInfo.postcode || '34000',
        
        shipping_address: userInfo.address || 'Turkey',
        shipping_city: userInfo.city || 'Istanbul', 
        shipping_country: 'Turkey',
        shipping_postcode: userInfo.postcode || '34000',

        // Return URLs
        success_url: `${window.location.origin}/payment/success`,
        fail_url: `${window.location.origin}/payment/failed`,
        callback_url: `${window.location.origin}/api/payment/callback`,

        // Additional parameters
        modul_version: 'emotice_1.0',
        random_nr: Math.floor(Math.random() * 1000000)
      }

      // Save pending payment to database
      await savePendingPayment(orderId, user.id, planType, selectedPlan.price, paymentData)

      // Create Shopier payment form
      const paymentFormHtml = generateShopierForm(paymentData)

      return {
        success: true,
        orderId,
        paymentFormHtml,
        paymentData
      }

    } catch (error) {
      console.error('Payment creation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Verify payment callback from Shopier
  verifyPaymentCallback: async (callbackData) => {
    try {
      const {
        platform_order_id,
        payment_id,
        total_order_value,
        currency,
        status,
        installment,
        random_nr,
        signature
      } = callbackData

      // Verify signature (basic verification)
      const expectedData = `${random_nr}${platform_order_id}${total_order_value}${currency}`
      
      // Get payment from database
      const { data: payment, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('external_subscription_id', platform_order_id)
        .single()

      if (error || !payment) {
        throw new Error('Payment not found')
      }

      if (status.toLowerCase() === 'success') {
        // Update subscription status
        const endDate = new Date()
        if (payment.plan_type === 'premium_monthly') {
          endDate.setMonth(endDate.getMonth() + 1)
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1)
        }

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: endDate.toISOString(),
            payment_provider: 'shopier',
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.id)

        // Update user profile
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'premium',
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.user_id)

        return {
          success: true,
          orderId: platform_order_id,
          paymentId: payment_id
        }
      } else {
        // Payment failed
        await supabase
          .from('subscriptions')
          .update({
            status: 'inactive',
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.id)

        return {
          success: false,
          error: 'Payment failed'
        }
      }

    } catch (error) {
      console.error('Payment verification error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Check subscription status
  checkSubscriptionStatus: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        const endDate = new Date(data.end_date)
        const now = new Date()

        if (endDate > now) {
          return {
            isActive: true,
            subscription: data,
            daysRemaining: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
          }
        } else {
          // Subscription expired, update status
          await supabase
            .from('subscriptions')
            .update({ status: 'expired' })
            .eq('id', data.id)

          await supabase
            .from('profiles')
            .update({ subscription_status: 'free' })
            .eq('id', userId)
        }
      }

      return {
        isActive: false,
        subscription: null,
        daysRemaining: 0
      }

    } catch (error) {
      console.error('Subscription check error:', error)
      return {
        isActive: false,
        subscription: null,
        daysRemaining: 0
      }
    }
  },

  // Cancel subscription
  cancelSubscription: async (userId) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'active')

      if (error) throw error

      await supabase
        .from('profiles')
        .update({
          subscription_status: 'free',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      return { success: true }

    } catch (error) {
      console.error('Subscription cancellation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Helper function to save pending payment
const savePendingPayment = async (orderId, userId, planType, amount, paymentData) => {
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: planType,
      status: 'inactive',
      start_date: new Date().toISOString(),
      payment_provider: 'shopier',
      external_subscription_id: orderId
    })

  if (error) {
    console.error('Error saving pending payment:', error)
  }
}

// Helper function to generate Shopier payment form HTML
const generateShopierForm = (paymentData) => {
  const formFields = Object.entries(paymentData)
    .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}">`)
    .join('\n')

  return `
    <form id="shopier-payment-form" method="POST" action="https://www.shopier.com/ShowProduct/api_pay4.php">
      ${formFields}
      <button type="submit" class="hidden">Pay with Shopier</button>
    </form>
    <script>
      document.getElementById('shopier-payment-form').submit();
    </script>
  `
}

export default paymentService
