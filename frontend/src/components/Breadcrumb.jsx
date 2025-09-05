import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ customItems = null, className = '' }) => {
  const location = useLocation();
  
  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    if (customItems) return customItems;
    
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [
      { name: 'Home', href: '/', current: false }
    ];
    
    // Add path-based breadcrumbs
    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      const isLast = index === pathnames.length - 1;
      
      let name = pathname.charAt(0).toUpperCase() + pathname.slice(1);
      
      // Customize names for specific routes
      switch (pathname) {
        case 'collection':
          name = 'Collection';
          break;
        case 'about':
          name = 'About Us';
          break;
        case 'contact':
          name = 'Contact';
          break;
        case 'cart':
          name = 'Shopping Cart';
          break;
        case 'login':
          name = 'Login';
          break;
        case 'profile':
          name = 'My Profile';
          break;
        case 'wishlist':
          name = 'My Wishlist';
          break;
        case 'orders':
          name = 'My Orders';
          break;
        case 'product':
          name = 'Product';
          break;
        default:
          break;
      }
      
      breadcrumbs.push({
        name,
        href: currentPath,
        current: isLast
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  // Generate structured data for breadcrumbs
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": breadcrumb.name,
        "item": `https://zerofashion.vercel.app${breadcrumb.href}`
      }))
    };
  };
  
  // Don't show breadcrumb on homepage
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <>
      {/* Structured Data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>
      
      {/* Visual Breadcrumb */}
      <nav 
        className={`flex w-full overflow-x-auto scrollbar-hide ${className}`} 
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 whitespace-nowrap min-w-max px-1">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.href} className="flex items-center shrink-0">
              {index > 0 && (
                <ChevronRight 
                  className="flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mx-1 sm:mx-2" 
                  aria-hidden="true" 
                />
              )}
              {breadcrumb.current ? (
                <span 
                  className="text-xs sm:text-sm font-medium text-gray-500 max-w-[120px] sm:max-w-[150px] md:max-w-none truncate"
                  aria-current="page"
                  title={breadcrumb.name}
                >
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.href}
                  className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 max-w-[120px] sm:max-w-[150px] md:max-w-none truncate transition-colors duration-200"
                  title={breadcrumb.name}
                >
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

Breadcrumb.propTypes = {
  customItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      current: PropTypes.bool
    })
  ),
  className: PropTypes.string
};

export default Breadcrumb;

// Helper function to generate product breadcrumbs
export const generateProductBreadcrumbs = (product) => {
  if (!product) return null;
  
  return [
    { name: 'Home', href: '/', current: false },
    { name: 'Collection', href: '/collection', current: false },
    { 
      name: product.category || 'Products', 
      href: `/collection?category=${product.category || ''}`, 
      current: false 
    },
    { 
      name: product.subCategory || 'Items', 
      href: `/collection?category=${product.category || ''}&subcategory=${product.subCategory || ''}`, 
      current: false 
    },
    { name: product.name, href: `/product/${product._id}`, current: true }
  ];
};

// Helper function to generate category breadcrumbs
export const generateCategoryBreadcrumbs = (category, subcategory = null) => {
  const breadcrumbs = [
    { name: 'Home', href: '/', current: false },
    { name: 'Collection', href: '/collection', current: !category && !subcategory }
  ];
  
  if (category) {
    breadcrumbs.push({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      href: `/collection?category=${category}`,
      current: !subcategory
    });
  }
  
  if (subcategory) {
    breadcrumbs.push({
      name: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
      href: `/collection?category=${category || ''}&subcategory=${subcategory}`,
      current: true
    });
  }
  
  return breadcrumbs;
};
