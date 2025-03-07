import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - would be replaced with a real API call
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      if (email === "admin@example.com" && password === "password") {
        const userData: User = {
          id: "1",
          name: "Admin User",
          email,
          role: "admin"
        };
        
        // Store the user in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("You have been logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
