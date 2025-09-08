import PropTypes from "prop-types";

const PriceTag = ({ price, discountPercent = 0, currency = "₹", className = "" }) => {
  const hasDiscount = typeof discountPercent === "number" && discountPercent > 0;
  const discountedPrice = hasDiscount
    ? Math.round((price * (100 - discountPercent)) / 100)
    : price;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-base font-bold text-black">
        {currency}{Number(discountedPrice).toLocaleString()}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-gray-500 line-through">
            {currency}{Number(price).toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-green-600">-{discountPercent}%</span>
        </>
      )}
    </div>
  );
};

PriceTag.propTypes = {
  price: PropTypes.number.isRequired,
  discountPercent: PropTypes.number,
  currency: PropTypes.string,
  className: PropTypes.string,
};

export default PriceTag;


