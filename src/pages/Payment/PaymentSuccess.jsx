// EMOTICE - Payment Success Page
// src/pages/Payment/PaymentSuccess.jsx
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Crown, ArrowRight, Home } from 'lucide-react'
import { paymentService } from '../../services/payment'
import { useAuth } from '../../hooks/useAuth'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const { user, updateProfile } = useAuth()

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get URL parameters from Shopier callback
        const orderId = searchParams.get('platform_order_id')
        const paymentId = searchParams.get('payment_id')
        const status = searchParams.get('status')

        if (status === 'success' && orderId) {
          // Verify payment with our backend
          const result = await paymentService.verifyPaymentCallback({
            platform_order_id: orderId,
            payment_id: paymentId,
            status: status,
            // Add other callback parameters as needed
          })

          if (result.success) {
            setVerified(true)
            // Update user profile to reflect premium status
            if (updateProfile) {
              await updateProfile({ subscription_status: 'premium' })
            }
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error)
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams, updateProfile])

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ödemeniz Doğrulanıyor</h2>
          <p className="text-gray-600">Lütfen bekleyin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {verified ? (
          <>
            {/* Success Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-green-200 rounded-full animate-ping"></div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Ödeme Başarılı!
            </h1>
            <p className="text-gray-600 mb-6">
              Premium üyeliğiniz aktif edildi. Artık tüm premium özelliklerden yararlanabilirsiniz!
            </p>

            {/* Premium Features */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-primary-900">Premium Özellikler Aktif</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>✨ Sınırsız mood tracking</div>
                <div>📊 Detaylı analytics ve raporlar</div>
                <div>🔮 Fal ve astroloji özellikleri</div>
                <div>💪 Premium motivasyon mesajları</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                Premium Özelliklerini Keşfet
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-medium py-2"
              >
                <Home className="w-5 h-5" />
                Ana Sayfaya Dön
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Sorularınız için{' '}
                <a href="/support" className="text-primary-600 hover:text-primary-700 underline">
                  destek ekibimizle
                </a>{' '}
                iletişime geçin.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Verification Failed */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Doğrulama Hatası
            </h1>
            <p className="text-gray-600 mb-6">
              Ödemeniz alındı ancak doğrulama sırasında bir hata oluştu. 
              Lütfen destek ekibimizle iletişime geçin.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/support')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Destek Ekibine Ulaş
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// EMOTICE - Payment Failed Page
// src/pages/Payment/PaymentFailed.jsx
import { useSearchParams, useNavigate } from 'react-router-dom'
import { XCircle, RefreshCw, Home, CreditCard } from 'lucide-react'

const PaymentFailed = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const errorCode = searchParams.get('error_code')
  const errorMessage = searchParams.get('error_message')

  const getErrorMessage = () => {
    switch (errorCode) {
      case 'insufficient_funds':
        return 'Kart bakiyeniz yetersiz. Lütfen başka bir kart deneyin.'
      case 'card_declined':
        return 'Kartınız reddedildi. Banka ile iletişime geçin.'
      case 'expired_card':
        return 'Kartınızın süresi dolmuş. Başka bir kart deneyin.'
      case 'invalid_card':
        return 'Kart bilgileri geçersiz. Kontrol edip tekrar deneyin.'
      case 'user_cancelled':
        return 'Ödeme işlemini iptal ettiniz.'
      default:
        return errorMessage || 'Ödeme sırasında bir hata oluştu. Lütfen tekrar deneyin.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ödeme Başarısız
        </h1>
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        {/* Error Details */}
        {errorCode && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-red-800">
              <strong>Hata Kodu:</strong> {errorCode}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/upgrade')}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Dene
          </button>
          
          <button
            onClick={() => navigate('/support')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Farklı Ödeme Yöntemi
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-medium py-2"
          >
            <Home className="w-5 h-5" />
            Ana Sayfaya Dön
          </button>
        </div>

        {/* Help Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Sorun devam ederse{' '}
            <a href="/support" className="text-primary-600 hover:text-primary-700 underline">
              destek ekibimizle iletişime geçin
            </a>
            <br />
            Size yardımcı olmaktan memnuniyet duyarız.
          </p>
        </div>

        {/* Common Issues */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Sık Karşılaşılan Sorunlar:</h3>
          <ul className="text-xs text-gray-600 text-left space-y-1">
            <li>• Kart bilgilerini kontrol edin</li>
            <li>• Bakiye yeterliliğini kontrol edin</li>
            <li>• İnternet bağlantınızı kontrol edin</li>
            <li>• Başka bir kart deneyin</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Export both components
export { PaymentSuccess, PaymentFailed }