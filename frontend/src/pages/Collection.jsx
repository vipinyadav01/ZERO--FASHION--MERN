import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "./../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "./../components/Title";
import ProductItem from "./../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState(() => {
    const savedCategory = localStorage.getItem('category');
    return savedCategory ? JSON.parse(savedCategory) : [];
  });
  const [subCategory, setSubCategory] = useState(() => {
    const savedSubCategory = localStorage.getItem('subCategory');
    return savedSubCategory ? JSON.parse(savedSubCategory) : [];
  });
  const [sortType, setSortType] = useState(() => {
    return localStorage.getItem('sortType') || "relevant";
  });
  const [loading, setLoading] = useState(true);

  const toggleCategory = (e) => {
    const value = e.target.value;
    const updatedCategory = category.includes(value)
      ? category.filter((item) => item !== value)
      : [...category, value];
    setCategory(updatedCategory);
    localStorage.setItem('category', JSON.stringify(updatedCategory));
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    const updatedSubCategory = subCategory.includes(value)
      ? subCategory.filter((item) => item !== value)
      : [...subCategory, value];
    setSubCategory(updatedSubCategory);
    localStorage.setItem('subCategory', JSON.stringify(updatedSubCategory));
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
        // Keep the current order for "relevant"
        break;
    }

    setFilterProducts(sortedProducts);
  };

  useEffect(() => {
    if (products.length > 0) {
      applyFilter();
    } else {
      setLoading(false);
    }
  }, [products, category, subCategory, search, showSearch]);

  useEffect(() => {
    if (filterProducts.length > 0) {
      sortProduct();
    }
    localStorage.setItem('sortType', sortType);
  }, [sortType, filterProducts]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-24 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          aria-expanded={showFilter}
          aria-controls="filter-options"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
            aria-hidden="true"
          />
        </button>

        {/* Category Filter */}
        <div
          id="filter-options"
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
            } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Men", "Women", "Kids"].map((cat) => (
              <label key={cat} className="flex gap-2 items-center">
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"
            } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Topwear", "Bottomwear", "Winterwear"].map((subCat) => (
              <label key={subCat} className="flex gap-2 items-center">
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  value={subCat}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(subCat)}
                />
                {subCat}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title text1={"All"} text2={"COLLECTIONS"} />
          {/* Product sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2 py-1 rounded"
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
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Map product */}
        {!loading && filterProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item) => (
              <ProductItem
                key={item._id}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        )}

        {/* No products found message */}
        {!loading && filterProducts.length === 0 && products.length > 0 && (
          <p className="text-center text-gray-500 mt-8">No products found matching your criteria. Try adjusting your filters.</p>
        )}

        {/* No products available message */}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No products available at the moment. Please check back later.</p>
        )}
      </div>
    </div>
  );
};

export default Collection;