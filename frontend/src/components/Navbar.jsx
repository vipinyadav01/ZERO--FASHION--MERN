import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import SearchBar from "./SearchBar";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const context = useContext(ShopContext);
  
  const {
    token = null,
    setShowSearch = () => console.warn("setShowSearch not available"),
    getCartCount = () => 0,
    showSearch = false,
  } = context || {};

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
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
          isTablet={isTablet}
        />
      )}
    </>
  );
};

export default Navbar;
