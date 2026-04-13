import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/newsletter/subscribe`, { email });
      if (res.data?.success) {
        toast.success("You're subscribed! Check your inbox.");
        setEmail("");
      } else {
        toast.error(res.data?.message || "Subscription failed. Try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg?.toLowerCase().includes("already")) {
        toast.info("You're already subscribed.");
      } else {
        toast.error(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-3">Newsletter</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
          Stay in the loop
        </h2>
        <p className="text-sm text-white/60 mb-8 max-w-md mx-auto">
          Exclusive drops, style edits & member-only offers — straight to your inbox.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col sm:flex-row items-center gap-0 max-w-md mx-auto"
        >
          <input
            className="w-full flex-1 px-5 py-4 bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-brand-surface transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Joining..." : "Join Now"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterBox;
