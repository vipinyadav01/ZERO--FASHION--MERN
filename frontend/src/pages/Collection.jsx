import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "./../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "./../components/Title";
import ProductItem from "./../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState(() => {
    const savedCategory = localStorage.getItem("category");
    return savedCategory ? JSON.parse(savedCategory) : [];
  });
  const [subCategory, setSubCategory] = useState(() => {
    const savedSubCategory = localStorage.getItem("subCategory");
    return savedSubCategory ? JSON.parse(savedSubCategory) : [];
  });
  const [sortType, setSortType] = useState(() => {
    return localStorage.getItem("sortType") || "relevant";
  });
  const [loading, setLoading] = useState(true);

  const toggleCategory = (e) => {
    const value = e.target.value;
    const updatedCategory = category.includes(value)
      ? category.filter((item) => item !== value)
      : [...category, value];
    setCategory(updatedCategory);
    localStorage.setItem("category", JSON.stringify(updatedCategory));
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    const updatedSubCategory = subCategory.includes(value)
      ? subCategory.filter((item) => item !== value)
      : [...subCategory, value];
    setSubCategory(updatedSubCategory);
    localStorage.setItem("subCategory", JSON.stringify(updatedSubCategory));
  };

  const applyFilter = () => {
    setLoading(true);
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
    setLoading(false);
  };

  const sortProduct = () => {
    let sortedProducts = [...filterProducts];

    switch (sortType) {
      case "low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilterProducts(sortedProducts);
  };

  useEffect(() => {
    if (products.length > 0) {
      applyFilter();
    }
  }, [products, category, subCategory, search, showSearch]);

  useEffect(() => {
    if (filterProducts.length > 0) {
      sortProduct();
    }
    localStorage.setItem("sortType", sortType);
  }, [sortType]);

  const FilterOption = ({ label, options, selectedOptions, toggleOption }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border border-gray-200 rounded-lg shadow-sm p-4 mb-4"
    >
      <p className="mb-3 text-sm font-medium text-gray-700">{label}</p>
      <div className="flex flex-col gap-2 text-sm font-light text-gray-600">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              type="checkbox"
              value={option}
              onChange={toggleOption}
              checked={selectedOptions.includes(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-14 border-t pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filter options */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:w-64"
      >
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="mb-4 text-xl flex items-center cursor-pointer gap-2 lg:hidden"
          aria-expanded={showFilter}
          aria-controls="filter-options"
        >
          FILTERS
          <motion.img
            animate={{ rotate: showFilter ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            className="h-3"
            src={assets.dropdown_icon}
            alt=""
            aria-hidden="true"
          />
        </button>

        <AnimatePresence>
          {(showFilter || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              id="filter-options"
              className="overflow-hidden"
            >
              <FilterOption
                label="CATEGORIES"
                options={["Men", "Women", "Kids"]}
                selectedOptions={category}
                toggleOption={toggleCategory}
              />
              <FilterOption
                label="TYPE"
                options={["Topwear", "Bottomwear", "Winterwear"]}
                selectedOptions={subCategory}
                toggleOption={toggleSubCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right Side */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        <div className="flex justify-between items-center text-base sm:text-2xl mb-6">
          <Title text1={"All"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortType}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Map product */}
        {!loading && filterProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filterProducts.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <ProductItem
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No products found message */}
        {!loading && filterProducts.length === 0 && products.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8"
          >
            No products found matching your criteria. Try adjusting your
            filters.
          </motion.p>
        )}

        {/* No products available message */}
        {!loading && products.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8"
          >
            No products available at the moment. Please check back later.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Collection;
