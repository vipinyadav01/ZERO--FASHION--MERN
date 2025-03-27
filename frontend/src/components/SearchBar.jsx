import { useState, useContext, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ShopContext } from '../context/ShopContext';

const SearchBar = ({ setShowSearchBar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const navigate = useNavigate();
    const { setShowSearch } = useContext(ShopContext);

    // Debounce effect for search input to optimize performance
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // 300ms debounce time
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (debouncedQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(debouncedQuery)}`);
            handleClose();
        }
    };

    const handleClose = () => {
        setShowSearchBar(false);
        setShowSearch(false);
        setSearchQuery(''); // Clear the search input when closing
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-2">
            <form onSubmit={handleSearch} className="relative flex items-center">
                {/* Search Icon */}
                <Search className="absolute left-4 text-gray-400" size={18} aria-hidden="true" />

                {/* Search Input */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, brands, and more..."
                    className="w-full pl-10 pr-16 py-3 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    aria-label="Search"
                />

                {/* Clear Search Button */}
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Close search"
                >
                    <X size={18} />
                </button>
            </form>
        </div>
    );
};

SearchBar.propTypes = {
    setShowSearchBar: PropTypes.func.isRequired,
};

export default SearchBar;
