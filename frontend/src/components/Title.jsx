import React from 'react'

function Title({ text1, text2 }) {
  return (
    <div className="inline-flex gap-3 items-center mb-4 text-2xl sm:text-2xl lg:text-3xl">
      <span className="text-gray-500 font-['Asterion']">
        {text1}
      </span>
      <span className="text-gray-700 font-medium font-['Asterion']">
        {text2}
      </span>
      <span className="w-12 sm:w-16 lg:w-20 h-1 bg-gray-700 block"></span>
    </div>
  )
}

export default Title
