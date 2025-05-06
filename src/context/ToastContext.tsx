"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Toast, 
  ToastAction, 
  ToastProvider as RadixToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose
} from '@/components/ui/toast';

type ToastType = 'default' | 'destructive' | 'success' | 'warning' | 'info';

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: ToastType;
  duration?: number;
}

interface ToastContextProps {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<ToastProps>) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Generate a unique ID for each toast
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Add a new toast to the array
  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, ...toast }]);
    return id;
  };

  // Remove a toast by ID
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Update an existing toast
  const updateToast = (id: string, toast: Partial<ToastProps>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  };

  // Auto-remove toasts based on their duration
  useEffect(() => {
    const timers = toasts.map((toast) => {
      const duration = toast.duration || 5000; // Default 5 seconds
      return setTimeout(() => {
        removeToast(toast.id);
      }, duration);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts]);

  const value = {
    toasts,
    addToast,
    removeToast,
    updateToast,
  };

  return (
    <ToastContext.Provider value={value}>
      <RadixToastProvider>
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.type}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
          >
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
            {toast.action && (
              <ToastAction altText={toast.action.label} onClick={toast.action.onClick}>
                {toast.action.label}
              </ToastAction>
            )}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}