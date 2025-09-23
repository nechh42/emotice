// EMOTICE - Payment Button Component
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  CreditCard, 
  Crown, 
  Check, 
  AlertCircle, 
  Loader2,
  Shield,
  Star,
  Zap
} from 'lucide-react'
import { paymentService } from '../../services/payment'
import { useAuth } from '../../hooks/useAuth'

// Validation schema for payment form
const paymentSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postcode: z.string().min(5, 'Postal code is required')
})

const PaymentButton = ({ planType = 'premium_monthly', onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { user, profile } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fullName: profile?.full_name || user?.user_metadata?.full_name || '',
      phone: '',
      address: '',
      city: 'Istanbul',
      postcode: ''
    }
  })

  // Plan details
  const planDetails = {
    premium_monthly: {
      name: 'Premium Aylık',
      price: 29.99,
      period: 'ay',
      description: 'Premium özellikler, sınırsız kullanım',
      features: [
        'Sınırsız mood tracking',
        'Detaylı analytics ve raporlar',
        'Fal ve astroloji özellikleri',
        'Premium motivasyon mesajları',
        'Öncelikli destek'
      ]
    },
    premium_yearly: {
      name: 'Premium Yıllık',
      price: 299.99,
      period: 'yıl', 
      originalPrice: 359.88,
      discount: '2 ay bedava!',
      description: 'En popüler plan - %17 tasarruf',
      features: [
        'Tüm premium özellikler',
        '2 ay bedava (14 ay kullanım)', 
        'Öncelikli yeni özellikler',
        'Özel premium içerikler',
        'VIP destek'
      ]
    }
  }

  const selectedPlan = planDetails[planType]

  const onSubmit = async (formData) => {
    try {
      setIsProcessing(true)
      setError('')

      // Create payment with Shopier
      const result = await paymentService.createPaymentLink(planType, {
        fullName: formData.fullName,
        email: user.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postcode: formData.postcode
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      // Create and submit payment form
      const formContainer = document.createElement('div')
      formContainer.innerHTML = result.paymentFormHtml
      document.body.appendChild(formContainer)

      // Form will auto-submit and redirect to Shopier

    } catch (error) {
      setError(error.message)
      setIsProcessing(false)
    }
  }

  if (!showForm) {
    return (
      <div className="max-w-md mx-auto">
        {/* Plan Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-primary-200">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Crown className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h3>
            {selectedPlan.discount && (
              <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mt-2">
                {selectedPlan.discount}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-gray-900">₺{selectedPlan.price}</span>
              <span className="text-gray-600">/{selectedPlan.period}</span>
            </div>
            {selectedPlan.originalPrice && (
              <div className="text-gray-500 line-through text-lg">
                ₺{selectedPlan.originalPrice}
              </div>
            )}
            <p className="text-gray-600 mt-2">{selectedPlan.description}</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {selectedPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowForm(true)}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Premium'a Geç
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>SSL ile güvenli ödeme</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700 float-left"
          >
            ← Geri
          </button>
          <h3 className="text-xl font-bold text-gray-900">Ödeme Bilgileri</h3>
          <p className="text-gray-600 mt-1">
            {selectedPlan.name} - ₺{selectedPlan.price}/{selectedPlan.period}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad *
            </label>
            <input
              {...register('fullName')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ad Soyad"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon Numarası *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="5XX XXX XX XX"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adres *
            </label>
            <textarea
              {...register('address')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Fatura adresi"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* City and Postcode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Şehir *
              </label>
              <input
                {...register('city')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="İstanbul"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posta Kodu *
              </label>
              <input
                {...register('postcode')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="34000"
              />
              {errors.postcode && (
                <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          {/* Payment Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Ödeme Sayfasına Yönlendiriliyor...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Güvenli Ödeme ile Devam Et
              </>
            )}
          </button>

          {/* Payment Info */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL şifreleme ile güvenli ödeme</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Star className="w-4 h-4" />
              <span>Shopier güvencesi ile ödeme alın</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Zap className="w-4 h-4" />
              <span>Ödeme sonrası anında aktif olur</span>
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center pt-2">
            Ödeme yaparak{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
              Hizmet Şartlarını
            </a>{' '}
            ve{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
              Gizlilik Politikasını
            </a>{' '}
            kabul etmiş sayılırsınız.
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentButton