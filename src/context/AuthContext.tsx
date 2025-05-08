
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export type UserRole = "creator" | "consumer" | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Azure API endpoints
const AZURE_AUTH_API = import.meta.env.VITE_AZURE_AUTH_API || "https://snapshare-api-d4eae7gwe4f5d5gt.uksouth-01.azurewebsites.net/api/auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function for authentication API requests
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${AZURE_AUTH_API}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Authentication error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Authentication API error:", error);
    throw error;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check authentication status on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await authFetch('me');
        setUser(userData);
      } catch (error) {
        // User is not authenticated - clear any stale data
        setUser(null);
        console.log("Not authenticated", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const userData = await authFetch('login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setUser(userData);
      toast({
        title: "Success",
        description: "You have been logged in",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);

    try {
      const userData = await authFetch('register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });

      setUser(userData);
      toast({
        title: "Success",
        description: "Your account has been created",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authFetch('logout', { method: 'POST' });
      setUser(null);
      
      // Force navigation to home page
      window.location.href = "/";
      
      toast({
        title: "Success",
        description: "You have been logged out",
        variant: "default",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, clear the user from state
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Mock authentication methods for development/testing
export const mockAuth = {
  // Mock methods would go here for local testing
};
