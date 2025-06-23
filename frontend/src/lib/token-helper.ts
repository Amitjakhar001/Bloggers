// lib/token-helper.ts
import Cookies from "js-cookie";

// Helper function to get token from cookies
export const getToken = (): string | null => {
  return Cookies.get("token") || null;
};

// Helper function to check if token exists and looks valid
export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;

  // Basic JWT format check (should have 3 parts separated by dots)
  const parts = token.split(".");
  return parts.length === 3;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to check if user is potentially authenticated
export const hasValidToken = (): boolean => {
  const token = getToken();
  return isValidToken(token);
};

// Helper function to clear invalid tokens
export const clearToken = () => {
  Cookies.remove("token");
};
