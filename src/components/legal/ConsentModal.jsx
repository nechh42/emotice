import React from "react"

const ConsentModal = ({ isOpen, onClose, onConsent }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Consent Required</h2>
        <button 
          onClick={() => onConsent({})}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export default ConsentModal