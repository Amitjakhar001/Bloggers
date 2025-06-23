"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";

export const user_service = "http://localhost:5000";
export const author_service = "http://localhost:5001";
export const blog_service = "http://localhost:5002";

export const blogCategories = [
  "Techonlogy",
  "Health",
  "Finance",
  "Travel",
  "Education",
  "Entertainment",
  "Study",
];

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  bio: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  blogcontent: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}

interface SavedBlogType {
  id: string;
  userid: string;
  blogid: string;
  create_at: string;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => Promise<void>;
  blogs: Blog[] | null;
  blogLoading: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  fetchBlogs: () => Promise<void>;
  savedBlogs: SavedBlogType[] | null;
  getSavedBlogs: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const token = Cookies.get("token");

      // If no token exists, just set loading to false
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${user_service}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error: any) {
      console.log("Error fetching user:", error);

      // Clear invalid token and reset state
      Cookies.remove("token");
      setUser(null);
      setIsAuth(false);
      setLoading(false);
    }
  }

  const [blogLoading, setBlogLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchBlogs() {
    setBlogLoading(true);
    try {
      const { data } = await axios.get(
        `${blog_service}/api/v1/blog/all?searchQuery=${searchQuery}&category=${category}`
      );

      setBlogs(data);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    } finally {
      setBlogLoading(false);
    }
  }

  const [savedBlogs, setSavedBlogs] = useState<SavedBlogType[] | null>(null);

  async function getSavedBlogs() {
    try {
      const token = Cookies.get("token");

      // Only fetch if user is authenticated and token exists
      if (!token || !isAuth) {
        return;
      }

      const { data } = await axios.get(
        `${blog_service}/api/v1/blog/saved/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedBlogs(data);
    } catch (error: any) {
      console.log("Error fetching saved blogs:", error);

      // If auth error, clear invalid token
      if (error.response?.status === 401) {
        Cookies.remove("token");
        setUser(null);
        setIsAuth(false);
        setSavedBlogs(null);
      }
    }
  }

  async function logoutUser() {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    setSavedBlogs(null);
    toast.success("User Logged Out");
  }

  // Initial load - only fetch user if token exists
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch saved blogs when auth status changes
  useEffect(() => {
    if (isAuth) {
      getSavedBlogs();
    }
  }, [isAuth]);

  // Fetch blogs when search/category changes
  useEffect(() => {
    fetchBlogs();
  }, [searchQuery, category]);

  return (
    <AppContext.Provider
      value={{
        user,
        setIsAuth,
        isAuth,
        setLoading,
        loading,
        setUser,
        logoutUser,
        blogs,
        blogLoading,
        setCategory,
        setSearchQuery,
        searchQuery,
        fetchBlogs,
        savedBlogs,
        getSavedBlogs,
      }}
    >
      <GoogleOAuthProvider clientId="178407096953-obhbj4k12tvutd6epmv0inb12f6cu1mb.apps.googleusercontent.com">
        {children}
        <Toaster />
      </GoogleOAuthProvider>
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useappdata must be used within AppProvider");
  }
  return context;
};