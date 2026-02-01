/**
 * Admin configuration constants
 */

export const ADMIN_CONFIG = {
  ITEMS_PER_PAGE: 10,
  GRID_ITEMS_PER_PAGE: 12,
  SEARCH_DEBOUNCE_MS: 500,
  API_TIMEOUT_MS: 10000,
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
};

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'cod', label: 'Cash on Delivery' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];
