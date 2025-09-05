import { authApi } from './api';

// Mock fetch and localStorage
global.fetch = jest.fn();

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

describe('authApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (window.localStorage.getItem as jest.Mock).mockClear();
    (window.localStorage.setItem as jest.Mock).mockClear();
    (window.localStorage.removeItem as jest.Mock).mockClear();
  });

  it('should register a new user', async () => {
    const mockResponse = {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'test-token',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await authApi.register('test@example.com', 'password123', 'Test User');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/auth/register',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('should login a user', async () => {
    const mockResponse = {
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'test-token',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await authApi.login('test@example.com', 'password123');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('should get current user', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    };

    (window.localStorage.getItem as jest.Mock).mockReturnValue('test-token');
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockUser),
    });

    const result = await authApi.getCurrentUser();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/auth/me',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      })
    );

    expect(result).toEqual(mockUser);
  });

  it('should handle registration errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    await expect(authApi.register('test@example.com', 'password123', 'Test User')).rejects.toThrow(
      'Registration failed'
    );
  });

  it('should handle login errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(authApi.login('test@example.com', 'password123')).rejects.toThrow('Login failed');
  });

  it('should handle get current user errors', async () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('test-token');
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(authApi.getCurrentUser()).rejects.toThrow('Failed to get user');
  });
});