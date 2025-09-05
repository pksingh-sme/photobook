// api.ts
import { Product, Order, Address, Photo, Album, Design, Review } from '@types/index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Auth API
export const authApi = {
  register: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const data = await response.json();
    return data;
  },
  
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    return data;
  },
  
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    
    const data = await response.json();
    return data;
  },
};

// Photo API
export const photoApi = {
  uploadPhoto: async (file: File, name?: string, albumId?: string) => {
    const formData = new FormData();
    formData.append('photo', file);
    if (name) formData.append('name', name);
    if (albumId) formData.append('albumId', albumId);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const response = await fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
    
    const data = await response.json();
    return data;
  },
  
  getPhotos: async (albumId?: string) => {
    const url = albumId 
      ? `${API_BASE_URL}/photos?albumId=${albumId}` 
      : `${API_BASE_URL}/photos`;
      
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get photos');
    }
    
    const data = await response.json();
    return data;
  },
  
  deletePhoto: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }
    
    const data = await response.json();
    return data;
  },
};

// Album API
export const albumApi = {
  createAlbum: async (name: string, isPublic: boolean = false) => {
    const response = await fetch(`${API_BASE_URL}/albums`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, isPublic }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create album');
    }
    
    const data = await response.json();
    return data;
  },
  
  getAlbums: async () => {
    const response = await fetch(`${API_BASE_URL}/albums`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get albums');
    }
    
    const data = await response.json();
    return data;
  },
  
  getAlbum: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/albums/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get album');
    }
    
    const data = await response.json();
    return data;
  },
  
  updateAlbum: async (id: string, name: string, isPublic: boolean) => {
    const response = await fetch(`${API_BASE_URL}/albums/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, isPublic }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update album');
    }
    
    const data = await response.json();
    return data;
  },
  
  deleteAlbum: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/albums/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete album');
    }
    
    const data = await response.json();
    return data;
  },
};

// Design API
export const designApi = {
  createDesign: async (name: string, description: string, data: any, thumbnail?: string, isPublic: boolean = false) => {
    const response = await fetch(`${API_BASE_URL}/designs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, description, data, thumbnail, isPublic }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create design');
    }
    
    const data = await response.json();
    return data;
  },
  
  getDesigns: async () => {
    const response = await fetch(`${API_BASE_URL}/designs`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get designs');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Get only templates (public designs)
  getTemplates: async () => {
    const response = await fetch(`${API_BASE_URL}/designs?isPublic=true`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get templates');
    }
    
    const data = await response.json();
    return data;
  },
  
  getDesign: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/designs/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get design');
    }
    
    const data = await response.json();
    return data;
  },
  
  updateDesign: async (id: string, name: string, description: string, data: any, thumbnail?: string, isPublic: boolean = false) => {
    const response = await fetch(`${API_BASE_URL}/designs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, description, data, thumbnail, isPublic }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update design');
    }
    
    const data = await response.json();
    return data;
  },
  
  deleteDesign: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/designs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete design');
    }
    
    const data = await response.json();
    return data;
  },
};

// Product API
export const productApi = {
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error('Failed to get products');
    }
    
    const data = await response.json();
    return data;
  },
  
  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to get product');
    }
    
    const data = await response.json();
    return data;
  },
  
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to get categories');
    }
    
    const data = await response.json();
    return data;
  },
};

// Review API
export const reviewApi = {
  // Get reviews for a product
  getReviews: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews?productId=${productId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get reviews');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Create a new review
  createReview: async (productId: string, rating: number, title: string, comment?: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, rating, title, comment }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create review');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Update an existing review
  updateReview: async (id: string, rating: number, title: string, comment?: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, title, comment }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update review');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Delete a review
  deleteReview: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
    
    const data = await response.json();
    return data;
  },
  
  // Mark a review as helpful
  markHelpful: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/helpful`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark review as helpful');
    }
    
    const data = await response.json();
    return data;
  },
};

// Order API
export const orderApi = {
  createOrder: async (items: any[], shippingAddressId: string, billingAddressId: string, paymentMethodId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items, shippingAddressId, billingAddressId, paymentMethodId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    const data = await response.json();
    return data;
  },
  
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get orders');
    }
    
    const data = await response.json();
    return data;
  },
  
  getOrder: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get order');
    }
    
    const data = await response.json();
    return data;
  },
};

// Address API
export const addressApi = {
  createAddress: async (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(address),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create address');
    }
    
    const data = await response.json();
    return data;
  },
  
  getAddresses: async () => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get addresses');
    }
    
    const data = await response.json();
    return data;
  },
  
  getAddress: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get address');
    }
    
    const data = await response.json();
    return data;
  },
  
  updateAddress: async (id: string, address: Partial<Address>) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(address),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update address');
    }
    
    const data = await response.json();
    return data;
  },
  
  deleteAddress: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete address');
    }
    
    const data = await response.json();
    return data;
  },
};