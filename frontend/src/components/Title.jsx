import React from 'react'

function Title({ text1, text2 }) {
  return (
    <div className="inline-flex gap-2 items-center mb-3 text-xl">
      <span className="text-gray-500 font-['Asterion']">
        {text1}
      </span>
      <span className="text-gray-700 font-medium font-['Asterion']">
        {text2}
      </span>
      <span className="w-8 sm:w-12 h-0.5 bg-gray-700 block"></span>
    </div>
  )
}

export default Title
