"use client"

import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import SearchBar from "./SearchBar"
import MobileNavbar from "./MobileNavbar"
import DesktopNavbar from "./DesktopNavbar"

const Navbar = () => {
  const { token, setShowSearch, getCartCount } = useContext(
    ShopContext,
  ) || {
    token: null,
    setShowSearch: () => { },
    getCartCount: () => 0,
  }

  return (
    <>
      
      <SearchBar />
      
      {/* Mobile Navbar */}
      <MobileNavbar 
        token={token}
        setShowSearch={setShowSearch}
        getCartCount={getCartCount}
      />

      {/* Desktop Navbar */}
      <DesktopNavbar 
        token={token}
        setShowSearch={setShowSearch}
        getCartCount={getCartCount}
      />
    </>
  )
}

export default Navbar
