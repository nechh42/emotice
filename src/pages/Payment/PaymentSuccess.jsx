// EMOTICE - Payment Success Page
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Crown, ArrowRight, Home, XCircle, RefreshCw, CreditCard } from 'lucide-react'
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
        const orderId = searchParams.get('platform_order_id')
        const paymentId = searchParams.get('payment_id')
        const status = searchParams.get('status')

        if (status === 'success' && orderId) {
          const result = await paymentService.verifyPaymentCallback({
            platform_order_id: orderId,
            payment_id: paymentId,
            status: status,
          })

          if (result.success) {
            setVerified(true)
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ödeme Doğrulanıyor</h2>
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2"> Ödeme Başarılı!</h1>
            <p className="text-gray-600 mb-6">Premium üyeliğiniz aktif edildi.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              Dashboard'a Git
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Doğrulama Hatası</h1>
            <p className="text-gray-600 mb-6">Lütfen destek ekibimizle iletişime geçin.</p>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccess
