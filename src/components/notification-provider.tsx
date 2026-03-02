"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useNotification } from './notification';

type NotificationContextType = ReturnType<typeof useNotification>;

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notification = useNotification();
  
  return (
    <NotificationContext.Provider value={notification}>
      {children}
      {notification.notificationComponents}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
} 