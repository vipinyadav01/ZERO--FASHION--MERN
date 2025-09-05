import PropTypes from 'prop-types'

function Title({ text1, text2, className = "", size = "default" }) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-lg sm:text-xl";
      case "lg":
        return "text-2xl sm:text-3xl lg:text-4xl";
      case "xl":
        return "text-3xl sm:text-4xl lg:text-5xl";
      default:
        return "text-xl sm:text-2xl lg:text-3xl";
    }
  };
  return (
    <div className={`inline-flex flex-wrap gap-2 sm:gap-3 items-center mb-3 sm:mb-4 ${getSizeClasses()} ${className}`}>
      <span className="text-gray-500 font-asterion whitespace-nowrap">
        {text1}
      </span>
      <span className="text-gray-700 font-medium font-asterion whitespace-nowrap">
        {text2}
      </span>
      <span className="w-8 sm:w-12 md:w-16 lg:w-20 h-0.5 sm:h-1 bg-gray-700 block flex-shrink-0"></span>
    </div>
  )
}

Title.propTypes = {
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'default', 'lg', 'xl'])
}

export default Title
