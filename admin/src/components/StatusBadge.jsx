/**
 * Reusable Status Badge Component
 */
import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
  const variants = {
    pending: 'bg-amber-50 border-amber-100 text-amber-700',
    processing: 'bg-brand-surface border-brand-border text-brand-text-primary',
    shipped: 'bg-brand-accent border-brand-accent text-white',
    delivered: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    cancelled: 'bg-red-50 border-red-100 text-red-700',
    paid: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    unpaid: 'bg-amber-50 border-amber-100 text-amber-700',
    failed: 'bg-red-50 border-red-100 text-red-700',
  };

  const colorClass = variants[status?.toLowerCase()] || 'bg-brand-surface border-brand-border text-brand-text-secondary';

  return (
    <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-transparent transition-all ${colorClass}`}>
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'paid',
    'unpaid',
    'failed',
  ]).isRequired,
  variant: PropTypes.oneOf(['default', 'subtle']),
};

export default StatusBadge;
