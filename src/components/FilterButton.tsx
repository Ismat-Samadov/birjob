"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface FilterButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  value?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  value
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`flex items-center gap-1 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 ${isActive ? 'border-blue-500 dark:border-blue-400' : ''}`}
      aria-expanded={isActive}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">
        {value ? `${label}: ${value}` : label}
      </span>
    </Button>
  );
};

export default FilterButton;