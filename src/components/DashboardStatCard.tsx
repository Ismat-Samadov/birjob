"use client";

import React, { ReactNode } from 'react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  bgClass?: string;
  titleClass?: string;
  valueClass?: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  icon,
  bgClass = "bg-blue-50 dark:bg-blue-900/30",
  titleClass = "text-blue-500 dark:text-blue-300",
  valueClass = "text-blue-700 dark:text-blue-300"
}) => {
  return (
    <div className={`rounded-lg p-4 ${bgClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className={`text-xs uppercase font-semibold ${titleClass}`}>{title}</div>
          <div className={`text-2xl font-bold mt-1 ${valueClass}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
        {icon && (
          <div className={titleClass}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStatCard;