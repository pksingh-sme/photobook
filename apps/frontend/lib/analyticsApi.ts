// analyticsApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const analyticsApi = {
  // Get overall statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/stats`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Get sales data for chart
  getSalesData: async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    const response = await fetch(`${API_BASE_URL}/analytics/sales?period=${period}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sales data');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Get user activity data
  getUserActivity: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/user-activity`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user activity');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Get top products
  getTopProducts: async (limit: number = 5) => {
    const response = await fetch(`${API_BASE_URL}/analytics/top-products?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch top products');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Get order statistics
  getOrderStats: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/orders`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch order stats');
    }
    
    const data = await response.json();
    return data;
  },
};