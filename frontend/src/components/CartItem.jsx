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
      className="flex items-center p-4 border-b border-brand-border hover:bg-brand-surface transition-all duration-300 group cursor-pointer"
      variants={slideUpAnimation}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 4 }}
      onClick={handleClick}
    >
      <div className="w-16 h-16 rounded-none mr-4 overflow-hidden border border-brand-border">
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
        <p className="text-sm font-semibold text-brand-text-primary truncate uppercase tracking-tight">
          {item.name || "Product"}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-brand-text-secondary mt-1 uppercase tracking-widest font-bold">
          <span className="bg-brand-surface px-2 py-1 border border-brand-border">
            Size: {item.size}
          </span>
          <span className="bg-brand-surface px-2 py-1 border border-brand-border">
            Qty: {item.quantity || 1}
          </span>
        </div>
      </div>

      <p className="text-sm font-bold text-brand-text-primary whitespace-nowrap ml-3 tracking-tighter">
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
