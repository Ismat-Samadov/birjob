"use client"

import React from 'react';

interface BarChartProps {
  data: {
    label: string;
    value: number;
  }[];
  colors: string[];
  height?: string;
  showPercentages?: boolean;
  totalValue?: number;
  emptyMessage?: string;
}

const HorizontalBarChart: React.FC<BarChartProps> = ({ 
  data, 
  colors,
  height = "h-96", 
  showPercentages = true,
  totalValue,
  emptyMessage = "No data available"
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full ${height} flex items-center justify-center`}>
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const calculatedTotal = totalValue !== undefined ? totalValue : data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className={`w-full ${height} overflow-y-auto`}>
      <div className="grid grid-cols-1 w-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 mb-4">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0" 
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <div className="flex-1">
              <div className="text-sm font-medium dark:text-gray-200 flex justify-between">
                <span className="truncate pr-2">{item.label}</span>
                <span className="font-semibold flex-shrink-0">
                  {showPercentages && calculatedTotal > 0 
                    ? `${(item.value / calculatedTotal * 100).toFixed(1)}%` 
                    : ''}
                </span>
              </div>
              <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full" 
                  style={{ 
                    width: `${maxValue > 0 ? (item.value / maxValue * 100) : 0}%`,
                    backgroundColor: colors[index % colors.length] 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.value.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBarChart;