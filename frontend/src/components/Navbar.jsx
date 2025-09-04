import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import SearchBar from "./SearchBar";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const context = useContext(ShopContext);
  
  const {
    token = null,
    setShowSearch = () => console.warn("setShowSearch not available"),
    getCartCount = () => 0,
    showSearch = false,
  } = context || {};

  // Handle responsive breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <SearchBar />
      {isMobile ? (
        <MobileNavbar 
          token={token}
          getCartCount={getCartCount}
          setShowSearch={setShowSearch}
        />
      ) : (
        <DesktopNavbar 
          token={token}
          setShowSearch={setShowSearch}
          getCartCount={getCartCount}
        />
      )}
    </>
  );
};

export default Navbar;
