import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({
  title = "Zero Fashion - Premium Fashion & Style Collection Online",
  description = "Discover premium fashion collections at Zero Fashion. Shop the latest trends in men's and women's clothing, shoes, and accessories with fast delivery and easy returns.",
  keywords = "fashion, clothing, online shopping, men fashion, women fashion, trendy clothes, premium fashion, style, zero fashion",
  author = "Zero Fashion",
  type = "website",
  image = "/hero_img.png",
  url = "https://zerofashion.vercel.app",
  siteName = "Zero Fashion",
  twitterCard = "summary_large_image",
  twitterSite = "@zerofashion",
  twitterCreator = "@zerofashion",
  structuredData = null,
  noindex = false,
  nofollow = false,
  canonical = null,
  hreflang = "en",
  robots = null,
  children
}) => {
  // Generate robots meta content
  const robotsContent = robots || (() => {
    const parts = [];
    if (noindex) parts.push('noindex');
    else parts.push('index');
    
    if (nofollow) parts.push('nofollow');
    else parts.push('follow');
    
    return parts.join(', ');
  })();

  // Ensure absolute URL for image
  const absoluteImage = image.startsWith('http') ? image : `${url}${image}`;
  
  // Generate canonical URL
  const canonicalUrl = canonical || url;

  return (
    <Helmet>
      {/* Title */}
      <title>{title}</title>

      {/* Basic Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language */}
      <html lang={hreflang} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:url" content={canonicalUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Additional custom elements */}
      {children}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  author: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  siteName: PropTypes.string,
  twitterCard: PropTypes.string,
  twitterSite: PropTypes.string,
  twitterCreator: PropTypes.string,
  structuredData: PropTypes.object,
  noindex: PropTypes.bool,
  nofollow: PropTypes.bool,
  canonical: PropTypes.string,
  hreflang: PropTypes.string,
  robots: PropTypes.string,
  children: PropTypes.node,
};

export default SEO;

// Predefined SEO configurations for common page types
export const SEOConfigs = {
  home: {
    title: "Zero Fashion - Premium Fashion & Style Collection Online",
    description: "Discover premium fashion collections at Zero Fashion. Shop the latest trends in men's and women's clothing, shoes, and accessories with fast delivery and easy returns.",
    keywords: "fashion, clothing, online shopping, men fashion, women fashion, trendy clothes, premium fashion, style, zero fashion",
    url: "https://zerofashion.vercel.app",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Zero Fashion - Home",
      "description": "Discover premium fashion collections at Zero Fashion",
      "url": "https://zerofashion.vercel.app",
      "mainEntity": {
        "@type": "Organization",
        "name": "Zero Fashion",
        "url": "https://zerofashion.vercel.app"
      }
    }
  },
  
  collection: {
    title: "Fashion Collection - Latest Trends | Zero Fashion",
    description: "Browse our complete fashion collection featuring the latest trends in clothing, accessories, and footwear. Find your perfect style at Zero Fashion.",
    keywords: "fashion collection, latest trends, clothing, accessories, footwear, men fashion, women fashion, zero fashion",
    url: "https://zerofashion.vercel.app/collection",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Fashion Collection",
      "description": "Browse our complete fashion collection",
      "url": "https://zerofashion.vercel.app/collection"
    }
  },
  
  about: {
    title: "About Zero Fashion - Our Story & Mission",
    description: "Learn about Zero Fashion's mission to provide premium quality fashion at affordable prices. Discover our story, values, and commitment to sustainable fashion.",
    keywords: "about zero fashion, fashion company, sustainable fashion, premium clothing, our story, fashion mission",
    url: "https://zerofashion.vercel.app/about",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Zero Fashion",
      "description": "Learn about Zero Fashion's mission and story",
      "url": "https://zerofashion.vercel.app/about"
    }
  },
  
  contact: {
    title: "Contact Zero Fashion - Customer Support & Help",
    description: "Get in touch with Zero Fashion customer support. Find our contact information, customer service hours, and get help with your orders and returns.",
    keywords: "contact zero fashion, customer support, help, contact information, customer service",
    url: "https://zerofashion.vercel.app/contact",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Zero Fashion",
      "description": "Get in touch with Zero Fashion customer support",
      "url": "https://zerofashion.vercel.app/contact"
    }
  },
  
  cart: {
    title: "Shopping Cart - Zero Fashion",
    description: "Review your selected items and proceed to checkout. Secure shopping experience with easy returns at Zero Fashion.",
    keywords: "shopping cart, checkout, secure shopping, zero fashion",
    url: "https://zerofashion.vercel.app/cart",
    noindex: true, // Cart pages typically shouldn't be indexed
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Shopping Cart",
      "description": "Review your selected items and proceed to checkout",
      "url": "https://zerofashion.vercel.app/cart"
    }
  },
  
  login: {
    title: "Login or Register - Zero Fashion Account",
    description: "Login to your Zero Fashion account or create a new account to access exclusive offers, track orders, and manage your wishlist.",
    keywords: "login, register, account, zero fashion, sign in, create account",
    url: "https://zerofashion.vercel.app/login",
    noindex: true, // Login pages typically shouldn't be indexed
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Login or Register",
      "description": "Login to your Zero Fashion account",
      "url": "https://zerofashion.vercel.app/login"
    }
  },
  
  wishlist: {
    title: "My Wishlist - Zero Fashion",
    description: "View and manage your favorite fashion items. Save products you love and get notified about price drops and availability.",
    keywords: "wishlist, favorite items, saved products, zero fashion",
    url: "https://zerofashion.vercel.app/wishlist",
    noindex: true, // Personal pages typically shouldn't be indexed
  }
};

// Helper function to generate product SEO data
export const generateProductSEO = (product) => {
  if (!product) return SEOConfigs.home;
  
  return {
    title: `${product.name} - Zero Fashion`,
    description: `Shop ${product.name} at Zero Fashion. ${product.description || 'Premium quality fashion item with fast delivery and easy returns.'} Price: $${product.price}`,
    keywords: `${product.name}, ${product.category || 'fashion'}, ${product.subCategory || 'clothing'}, online shopping, zero fashion, ${product.sizes?.join(', ') || ''}`,
    url: `https://zerofashion.vercel.app/product/${product._id}`,
    image: product.image?.[0] || '/hero_img.png',
    type: "product",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `Premium ${product.name} from Zero Fashion`,
      "image": product.image || ["/hero_img.png"],
      "brand": {
        "@type": "Brand",
        "name": "Zero Fashion"
      },
      "category": product.category || "Fashion",
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD",
        "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Zero Fashion"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 1
      } : undefined,
      "sku": product._id,
      "url": `https://zerofashion.vercel.app/product/${product._id}`
    }
  };
};

// Helper function to generate category SEO data
export const generateCategorySEO = (category, subcategory = null) => {
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Collection';
  const subcategoryName = subcategory ? ` - ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}` : '';
  const fullCategoryName = `${categoryName}${subcategoryName}`;
  
  return {
    title: `${fullCategoryName} - Zero Fashion Collection`,
    description: `Explore our ${fullCategoryName.toLowerCase()} collection at Zero Fashion. Find the latest trends and premium quality ${category || 'fashion items'} with fast delivery.`,
    keywords: `${category || 'fashion'}, ${subcategory || ''}, collection, clothing, online shopping, zero fashion, ${fullCategoryName.toLowerCase()}`,
    url: `https://zerofashion.vercel.app/collection?category=${category || ''}${subcategory ? `&subcategory=${subcategory}` : ''}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${fullCategoryName} Collection`,
      "description": `Explore our ${fullCategoryName.toLowerCase()} collection`,
      "url": `https://zerofashion.vercel.app/collection?category=${category || ''}${subcategory ? `&subcategory=${subcategory}` : ''}`
    }
  };
};
