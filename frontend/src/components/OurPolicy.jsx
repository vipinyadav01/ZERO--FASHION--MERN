import { RefreshCw, RotateCcw, Headphones } from "lucide-react";

const policies = [
  {
    icon: RefreshCw,
    title: "Easy Exchange Policy",
    desc: "Hassle-free exchanges within 7 days of delivery.",
  },
  {
    icon: RotateCcw,
    title: "7 Days Return Policy",
    desc: "Changed your mind? Return within 7 days, no questions asked.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    desc: "Our team is always here to help — any time, any day.",
  },
];

const OurPolicy = () => {
  return (
    <section className="bg-[#F8F8F6] border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
          {policies.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center px-8 py-8 sm:py-0 gap-4">
              <div className="p-4 bg-white border border-brand-border">
                <Icon className="w-6 h-6 text-brand-text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-black text-brand-text-primary uppercase tracking-widest mb-1">{title}</p>
                <p className="text-xs text-brand-text-secondary leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
