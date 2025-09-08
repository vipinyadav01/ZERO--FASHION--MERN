import { memo } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const slideUpAnimation = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 20 } 
  },
};

const CartItem = memo(({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <motion.div
      className="flex items-center p-4 border-b border-stone-100/80 hover:bg-stone-50/50 transition-all duration-300 group cursor-pointer"
      variants={slideUpAnimation}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 4 }}
      onClick={handleClick}
    >
      <div className="w-16 h-16 rounded-xl mr-4 overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300">
        <motion.img
          src={item.image || "/placeholder.svg"}
          alt={item.name || "Product"}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => { 
            e.target.src = "/placeholder.svg" 
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-800 truncate font-outfit group-hover:text-stone-900 transition-colors">
          {item.name || "Product"}
        </p>
        <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
          <span className="bg-stone-100 px-2 py-1 rounded-md font-medium group-hover:bg-stone-200 transition-colors">
            Size: {item.size}
          </span>
          <span className="bg-stone-100 px-2 py-1 rounded-md font-medium group-hover:bg-stone-200 transition-colors">
            Qty: {item.quantity || 1}
          </span>
        </div>
      </div>

      <p className="text-sm font-bold text-stone-900 whitespace-nowrap ml-3 group-hover:text-stone-800 transition-colors">
        ₹{item.price?.toFixed(2) || "0.00"}
      </p>
    </motion.div>
  );
});

CartItem.displayName = "CartItem";

CartItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
};

export default CartItem;
