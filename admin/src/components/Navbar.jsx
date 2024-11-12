import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = () => {
    setIsLoading(true)
    // Simulating an async logout process
    setTimeout(() => {
      setToken('')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <img 
              className="w-[max(10%,80px)] h-auto" 
              src={assets.logo} 
              alt="Company logo" 
            />
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`
                flex items-center justify-center
                px-4 py-2 sm:px-6 sm:py-3
                text-sm sm:text-base font-medium
                rounded-full
                text-white
                transition duration-150 ease-in-out
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  <span>Logging out...</span>
                </>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

const Loader = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

export default Navbar