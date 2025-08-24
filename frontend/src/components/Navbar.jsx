import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import SearchBar from "./SearchBar";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

const Navbar = () => {
  const context = useContext(ShopContext);
  
  const {
    token = null,
    setShowSearch = () => console.warn("setShowSearch not available"),
    getCartCount = () => 0,
    showSearch = false,
  } = context || {};

  return (
    <>
      <SearchBar />
      <MobileNavbar 
        token={token}
        setShowSearch={setShowSearch}
        getCartCount={getCartCount}
      />
      <DesktopNavbar 
        token={token}
        setShowSearch={setShowSearch}
        getCartCount={getCartCount}
      />
    </>
  );
};

export default Navbar;
