"use client"

import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import RelatedProducts from "../components/RelatedProducts"
import Title from "../components/Title"
import SEO, { generateProductSEO } from "../components/SEO"
import Breadcrumb, { generateProductBreadcrumbs } from "../components/Breadcrumb"
import { Heart } from "lucide-react"

const Product = () => {
  const { productId } = useParams()
  const { 
    products, 
    currency, 
    addMultipleSizesToCart, 
    addToWishlist, 
    removeFromWishlist, 
    isProductInWishlist,
    isLoading 
  } = useContext(ShopContext)
  const [productData, setProductData] = useState(null) 
  const [image, setImage] = useState("")
  const [selectedSizes, setSelectedSizes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("description")
  const [isInWishlist, setIsInWishlist] = useState(false)

  const fetchProductData = () => {
    setLoading(true)
    if (products && products.length > 0) {
      const product = products.find((item) => item && item._id === productId)
      if (product) {
        setProductData(product)
        const firstImage = product.image && product.image.length > 0 ? product.image[0] : "/placeholder.svg"
        setImage(firstImage)
      }
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchProductData()
  }, [productId, products])

  // Check wishlist status when product data is available
  useEffect(() => {
    const checkWishlist = async () => {
      if (productData && productData._id) {
        const status = isProductInWishlist(productData._id)
        setIsInWishlist(status)
      }
    }
    checkWishlist()
  }, [productData, isProductInWishlist])

  const handleWishlistToggle = async () => {
    if (!productData) return
    try {
      if (isInWishlist) {
        await removeFromWishlist(productData._id)
        setIsInWishlist(false)
      } else {
        await addToWishlist(productData._id)
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }
  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  const handleAddToCart = () => {
    addMultipleSizesToCart(productData._id, selectedSizes)
  }

  if (loading || !productData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-2 border-black rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO {...generateProductSEO(productData)} />
      <div className="container mx-auto px-4 py-16 mt-8 sm:mt-16">
        <Breadcrumb 
          customItems={generateProductBreadcrumbs(productData)} 
          className="mb-8"
        />
        <div className="flex flex-col lg:flex-row gap-12">
        {/*---------- product images ----------*/}
        <div className="flex-1 flex flex-col-reverse gap-6 lg:flex-row">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto gap-4 lg:w-[20%] w-full no-scrollbar">
            {productData.image && productData.image.length > 0 ? (
              productData.image.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setImage(item)}
                  className={`cursor-pointer border ${image === item ? "border-black" : "border-transparent"} transition-all duration-300`}
                >
                  <img
                    src={item || "/placeholder.svg"}
                    className="w-24 h-24 lg:w-full lg:h-auto object-cover"
                    alt={`${productData.name} - view ${index + 1}`}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="w-24 h-24 lg:w-full lg:h-auto bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">No images</span>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[80%] bg-gray-50">
            <img 
              src={image || "/placeholder.svg"} 
              className="w-full h-auto object-contain mix-blend-multiply" 
              alt={productData.name}
              onError={(e) => {
                e.target.src = "/placeholder.svg";
              }}
            />
          </div>
        </div>

        {/*---------- product info ----------*/}
        <div className="flex-1 flex flex-col">
          <span className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            {productData.category} / {productData.subCategory}
          </span>
          
          <h1 className="text-2xl sm:text-3xl font-medium text-black mb-4">{productData.name}</h1>

          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-lg ${i < 4 ? "text-black" : "text-gray-300"}`}>★</span>
            ))}
            <p className="pl-2 text-sm text-gray-600">(199 reviews)</p>
          </div>

          <p className="text-2xl font-medium text-black mb-8">
            {currency}
            {productData.price}
          </p>

          <div className="h-px w-full bg-gray-200 my-6"></div>

          <p className="text-gray-700 mb-8 leading-relaxed">{productData.description}</p>

          <div className="mb-8">
            <p className="font-medium mb-3 uppercase text-sm tracking-widest">Select Sizes</p>
            <div className="flex flex-wrap gap-3">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSizeToggle(item)}
                  className={`h-12 w-12 flex items-center justify-center border-2 transition-all duration-200 ${
                    selectedSizes.includes(item) 
                      ? "border-black bg-black text-white" 
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">Select multiple sizes as needed</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={selectedSizes.length === 0}
              className={`flex-1 py-4 uppercase text-sm tracking-widest font-medium transition-all duration-300 ${
                selectedSizes.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {selectedSizes.length === 0 ? "SELECT A SIZE" : `ADD ${selectedSizes.length} ITEM${selectedSizes.length > 1 ? 'S' : ''} TO CART`}
            </button>

            <button
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className={`p-4 border-2 transition-all duration-300 ${
                isInWishlist
                  ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
              }`}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} 
              />
            </button>
          </div>

          <div className="h-px w-full bg-gray-200 my-8"></div>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>100% Original Product</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Cash on delivery is available</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Easy return and exchange policy within 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/*----------- Description & Review----------*/}
      <div className="mt-20">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-4 text-sm font-medium uppercase tracking-widest transition-colors ${
              activeTab === "description" 
                ? "border-b-2 border-black text-black" 
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`px-6 py-4 text-sm font-medium uppercase tracking-widest transition-colors ${
              activeTab === "reviews" 
                ? "border-b-2 border-black text-black" 
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews (199)
          </button>
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div className="text-gray-700 space-y-4">
              <p>
                An e-commerce website is a virtual store where customers can buy and sell products and services online
              </p>
              <p>
                An e-commerce website allows customers to browse products, place orders, and make payments. It also
                allows businesses to process orders, manage shipping, and provide customer service
              </p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="text-gray-700">
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-lg mb-4">Reviews coming soon</p>
                <div className="w-12 h-1 bg-black"></div>
              </div>
            </div>
          )}
        </div>
      </div>

              {/*----------- Related Products----------*/}
        <div className="mt-20">
          <div className="text-center mb-6">
            <Title text1="RELATED" text2="PRODUCTS" />
          </div>
          <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
      </div>
    </>
  )
}

export default Product