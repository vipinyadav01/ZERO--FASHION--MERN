import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl, currency } from "../App";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeleting(id);
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Product removed successfully");
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(error.message || "Failed to remove product");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin border-2 border-gray-300 border-t-blue-600 rounded-full w-8 h-8" />
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="bg-blue-50 text-blue-700 p-4 rounded-md my-4">
        No products found. Add some products to see them listed here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">All Products</h2>

      <div className="border rounded-md">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center p-4 bg-gray-50 text-sm font-medium">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product List */}
        <div className="divide-y">
          {list.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-md overflow-hidden">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600">{item.category}</span>

              <span className="text-gray-900">
                {currency}
                {item.price.toLocaleString()}
              </span>

              <button
                onClick={() => handleRemoveProduct(item._id)}
                disabled={deleting === item.id}
                className="justify-self-center w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting === item.id ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-lg">×</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
