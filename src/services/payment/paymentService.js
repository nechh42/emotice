// EMOTICE - Payment Service (Updated Pricing)
import { supabase } from '../../lib/supabase'

const plans = {
  premium_monthly: { 
    id: 'monthly',
    price: 15, 
    priceLocal: 442,
    currency: 'USD',
    currencyLocal: 'TRY',
    name: 'Emotice Premium - Aylık',
    description: 'Sınırsız mood tracking, premium özellikler',
    duration: 1,
    discount: 0
  },
  premium_3month: { 
    id: '3month',
    price: 35, 
    priceLocal: 1032,
    currency: 'USD',
    currencyLocal: 'TRY',
    name: 'Emotice Premium - 3 Aylık',
    description: 'Popüler seçim - 3 ay premium erişim', 
    duration: 3,
    discount: 22
  },
  premium_6month: { 
    id: '6month',
    price: 60, 
    priceLocal: 1769,
    currency: 'USD',
    currencyLocal: 'TRY',
    name: 'Emotice Premium - 6 Aylık',
    description: 'En uygun fiyat - 6 ay premium erişim',
    duration: 6,
    discount: 33
  }
}

export const paymentService = {
  getPlans: () => plans,
  
  createPayment: async (planType, userInfo) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const selectedPlan = plans[planType]
      if (!selectedPlan) throw new Error('Invalid plan type')

      // Generate order ID
      const orderId = EMO__

      // Save pending payment to database
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_type: planType,
          status: 'pending',
          amount: selectedPlan.priceLocal,
          currency: selectedPlan.currencyLocal,
          external_subscription_id: orderId,
          start_date: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { 
        success: true, 
        orderId,
        paymentUrl: /payment/checkout?plan=&order=,
        plan: selectedPlan
      }
    } catch (error) {
      console.error('Payment creation error:', error)
      return { success: false, error: error.message }
    }
  },

  verifyPayment: async (orderId, paymentData) => {
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('external_subscription_id', orderId)
        .single()

      if (error || !subscription) {
        throw new Error('Payment not found')
      }

      // Update subscription status
      const plan = plans[subscription.plan_type]
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + plan.duration)

      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id)

      // Update user profile
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'premium',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.user_id)

      return { success: true, subscription }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
