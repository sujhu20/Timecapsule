"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  joinDate: Date;
  capsuleCount: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    joinDate: new Date("2023-05-15"),
    capsuleCount: 7,
    image: "https://api.dicebear.com/7.x/initials/svg?seed=JD&backgroundColor=00897b"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    joinDate: new Date("2023-08-22"),
    capsuleCount: 3,
    image: "https://api.dicebear.com/7.x/initials/svg?seed=JS&backgroundColor=6a1b9a"
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if a user is already signed in (from localStorage in this mock example)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert string dates back to Date objects
        parsedUser.joinDate = new Date(parsedUser.joinDate);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Create a cleaned user object without the password
      const authenticatedUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        image: foundUser.image,
        joinDate: foundUser.joinDate,
        capsuleCount: foundUser.capsuleCount
      };
      
      // Store in state and localStorage
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      return;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email is already in use
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user (in a real app, this would be done via an API)
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        joinDate: new Date(),
        capsuleCount: 0,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${name.split(' ').map(n => n[0]).join('')}&backgroundColor=1e88e5`
      };
      
      // Store in state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // In a real app, you would send this data to your backend
      return;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 