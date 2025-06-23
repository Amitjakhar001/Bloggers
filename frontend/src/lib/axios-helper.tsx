// lib/axios-helpers.ts
import axios from "axios";
import { getAuthHeaders } from "./token-helper";

// Helper functions for common API patterns
export const authGet = async (url: string) => {
    const headers = getAuthHeaders();
    return await axios.get(url, { headers });
};

export const authPost = async (url: string, data: any) => {
    const headers = getAuthHeaders();
    return await axios.post(url, data, { headers });
};

export const authDelete = async (url: string) => {
    const headers = getAuthHeaders();
    return await axios.delete(url, { headers });
};

export const authPut = async (url: string, data: any) => {
    const headers = getAuthHeaders();
    return await axios.put(url, data, { headers });
};