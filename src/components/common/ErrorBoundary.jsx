import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
    <div className="max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-xl font-bold text-red-800 mb-4">Bir Hata Oluştu</h2>
      <button onClick={resetErrorBoundary} className="bg-blue-600 text-white px-4 py-2 rounded">Tekrar Dene</button>
    </div>
  </div>
)

export default ErrorFallback