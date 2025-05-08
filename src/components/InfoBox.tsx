// src/components/InfoBox.tsx
"use client"

import React, { ReactNode } from 'react';

interface InfoBoxProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 mb-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="text-blue-700 dark:text-blue-200 text-sm">
        {children}
      </div>
    </div>
  );
};

export default InfoBox;