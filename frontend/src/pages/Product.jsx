"use client"

import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import { assets } from "../assets/assets"
import RelatedProducts from "../components/RelatedProducts"
import { motion, AnimatePresence } from "framer-motion"

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(null) 
  const [image, setImage] = useState("")
  const [size, setSize] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("description")

  const fetchProductData = () => {
    setLoading(true)
    if (products && products.length > 0) {
      const product = products.find((item) => item && item._id === productId)
      if (product) {
        setProductData(product)
        setImage(product.image[0])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products])

  if (loading || !productData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-12 mt-16 sm:mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/*---------- product images ----------*/}
        <motion.div
          className="flex-1 flex flex-col-reverse gap-4 lg:flex-row"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] gap-3 lg:w-[20%] w-full">
            {productData.image.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${image === item ? "border-gray-800" : "border-transparent"}`}
              >
                <img
                  onClick={() => setImage(item)}
                  src={item || "/placeholder.svg"}
                  className="w-20 h-20 lg:w-full lg:h-auto object-cover"
                  alt={`${productData.name} - view ${index + 1}`}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="w-full lg:w-[80%] rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src={image || "/placeholder.svg"} className="w-full h-auto object-cover" alt={productData.name} />
          </motion.div>
        </motion.div>

        {/*---------- product info ----------*/}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{productData.name}</h1>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="w-4 h-4" />
            ))}
            <p className="pl-2 text-sm text-gray-600">(199 reviews)</p>
          </div>

          <p className="text-3xl font-bold text-gray-900 mb-6">
            {currency}
            {productData.price}
          </p>

          <p className="text-gray-600 mb-8 leading-relaxed">{productData.description}</p>

          <div className="mb-8">
            <p className="font-medium mb-3">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {productData.sizes.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSize(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-2 px-4 rounded-lg transition-all duration-200 ${
                    item === size ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            onClick={() => addToCart(productData._id, size)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!size}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
              !size
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 active:bg-gray-700"
            }`}
          >
            {!size ? "SELECT A SIZE" : "ADD TO CART"}
          </motion.button>

          <hr className="my-8" />

          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              100% Original Product
            </p>
            <p className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Cash on delivery is available
            </p>
            <p className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Easy return and exchange policy within 7 days
            </p>
          </div>
        </motion.div>
      </div>

      {/*----------- Description & Review----------*/}
      <div className="mt-16">
        <div className="flex border-b">
          <button
            className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === "description" ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === "reviews" ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews (199)
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "description" && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6 text-gray-600 space-y-4"
            >
              <p>
                An e-commerce website is a virtual store where customers can buy and sell products and services online
              </p>
              <p>
                An e-commerce website allows customers to browse products, place orders, and make payments. It also
                allows businesses to process orders, manage shipping, and provide customer service
              </p>
            </motion.div>
          )}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6 text-gray-600"
            >
              <p className="text-center py-8">Reviews coming soon</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*----------- Related Products----------*/}
      <div className="mt-16">
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </motion.div>
  )
}
export default Product