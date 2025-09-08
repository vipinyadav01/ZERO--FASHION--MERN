import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    discountPercent: 0,
    category: "",
    subCategory: "",
    sizes: [],
    bestseller: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
        if (!res?.data?.success) throw new Error(res?.data?.message || "Failed to load product");
        const p = res.data.product;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || 0,
          discountPercent: p.discountPercent || 0,
          category: p.category || "",
          subCategory: p.subCategory || "",
          sizes: p.sizes || [],
          bestseller: !!p.bestseller,
        });
      } catch (e) {
        toast.error(e.message || "Error loading product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        {
          ...form,
          sizes: form.sizes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product updated");
      navigate("/list");
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-200">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-slate-200 mb-2">Name</label>
          <input className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100" value={form.name} onChange={(e)=>handleChange('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-200 mb-2">Price</label>
          <input type="number" className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100" value={form.price} onChange={(e)=>handleChange('price', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-slate-200 mb-2">Discount (%)</label>
          <input type="number" min={0} max={100} className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100" value={form.discountPercent} onChange={(e)=>handleChange('discountPercent', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-200 mb-2">Description</label>
          <textarea className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100" rows="4" value={form.description} onChange={(e)=>handleChange('description', e.target.value)} />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={()=>navigate(-1)} className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;


