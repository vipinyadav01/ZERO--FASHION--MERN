/**
 * Reusable Status Badge Component
 */
import PropTypes from 'prop-types';

const StatusBadge = ({ status, variant = 'default' }) => {
  const variants = {
    default: {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-orange-100 text-orange-800',
      failed: 'bg-red-100 text-red-800',
    },
    subtle: {
      pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      processing: 'bg-blue-50 text-blue-700 border border-blue-200',
      shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      delivered: 'bg-green-50 text-green-700 border border-green-200',
      cancelled: 'bg-red-50 text-red-700 border border-red-200',
      paid: 'bg-green-50 text-green-700 border border-green-200',
      unpaid: 'bg-orange-50 text-orange-700 border border-orange-200',
      failed: 'bg-red-50 text-red-700 border border-red-200',
    },
  };

  const statusLabel = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    paid: 'Paid',
    unpaid: 'Unpaid',
    failed: 'Failed',
  };

  const colorClass = variants[variant]?.[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}>
      {statusLabel[status?.toLowerCase()] || status}
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
