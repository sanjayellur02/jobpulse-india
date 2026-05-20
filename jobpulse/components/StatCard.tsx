import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  description,
}: StatCardProps) {
  // Normalize value to string for consistent rendering (Q8)
  const displayValue = String(value);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{displayValue}</p>
          {description && <p className="text-gray-500 text-xs mt-1">{description}</p>}
        </div>
        {icon && <div className="text-blue-600 text-2xl">{icon}</div>}
      </div>
      {trend !== undefined && (
        <div className={`mt-4 text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </div>
      )}
    </div>
  );
}
