/**
 * Reusable Stat Card Component for Dashboard
 */
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PropTypes from 'prop-types';

const StatCard = ({ title, value, change, icon: Icon, trend = 'up', color = 'brand' }) => {
  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="bg-white border border-brand-border rounded-none p-8 transition-all hover:bg-brand-surface group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-brand-text-secondary mb-2 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-black text-brand-text-primary tracking-tighter">{value}</h3>
        </div>
        {Icon && (
          <div className="p-4 bg-brand-surface text-brand-text-primary group-hover:bg-brand-accent group-hover:text-white transition-all">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <div className={`flex items-center p-1 border ${trend === 'up' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
          <span className="text-brand-text-secondary opacity-60">vs last period</span>
        </div>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.number,
  icon: PropTypes.elementType,
  trend: PropTypes.oneOf(['up', 'down']),
  color: PropTypes.oneOf(['indigo', 'green', 'blue', 'purple']),
};

export default StatCard;
