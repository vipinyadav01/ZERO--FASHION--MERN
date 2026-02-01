/**
 * Reusable Stat Card Component for Dashboard
 */
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PropTypes from 'prop-types';

const StatCard = ({ title, value, change, icon: Icon, trend = 'up', color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`${colorMap[color]} border rounded-lg p-6 transition-all hover:shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-600" />
          )}
          <span className={trendColor}>{Math.abs(change)}%</span>
          <span className="text-gray-500">from last month</span>
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
