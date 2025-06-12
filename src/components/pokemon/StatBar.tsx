import React from 'react';
import { calculateStatPercentage, formatStatName } from '../../utils/pokemon';

interface StatBarProps {
  statName: string;
  statValue: number;
  maxValue?: number;
}

export const StatBar: React.FC<StatBarProps> = ({ statName, statValue, maxValue = 200 }) => {
  const percentage = calculateStatPercentage(statValue);
  
  // Color based on stat value
  const getStatColor = (value: number) => {
    if (value >= 120) return 'bg-green-500';
    if (value >= 90) return 'bg-yellow-500';
    if (value >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
        {formatStatName(statName)}
      </div>
      
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${getStatColor(statValue)} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={statValue}
          aria-valuemin={0}
          aria-valuemax={maxValue}
          aria-label={`${formatStatName(statName)}: ${statValue}`}
        ></div>
      </div>
      
      <div className="w-12 text-sm font-bold text-gray-900 dark:text-white text-right">
        {statValue}
      </div>
    </div>
  );
};