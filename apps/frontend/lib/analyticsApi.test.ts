// analyticsApi.test.ts
import { analyticsApi } from './analyticsApi';

// Mock fetch
global.fetch = jest.fn();

describe('analyticsApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getStats', () => {
    it('should fetch stats successfully', async () => {
      const mockStats = {
        totalRevenue: 10000,
        totalOrders: 50,
        totalUsers: 100,
        avgOrderValue: 200,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      });

      const result = await analyticsApi.getStats();
      
      expect(result).toEqual(mockStats);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/analytics/stats',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should throw an error when fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(analyticsApi.getStats()).rejects.toThrow('Failed to fetch stats');
    });
  });

  describe('getSalesData', () => {
    it('should fetch sales data with default period', async () => {
      const mockSalesData = [
        { date: '2023-01-01', amount: 1000 },
        { date: '2023-01-02', amount: 1500 },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSalesData,
      });

      const result = await analyticsApi.getSalesData();
      
      expect(result).toEqual(mockSalesData);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/analytics/sales?period=month',
        expect.any(Object)
      );
    });

    it('should fetch sales data with specified period', async () => {
      const mockSalesData = [
        { date: '2023-01-01', amount: 1000 },
        { date: '2023-01-02', amount: 1500 },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSalesData,
      });

      const result = await analyticsApi.getSalesData('week');
      
      expect(result).toEqual(mockSalesData);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/analytics/sales?period=week',
        expect.any(Object)
      );
    });
  });

  describe('getUserActivity', () => {
    it('should fetch user activity data', async () => {
      const mockActivity = {
        activeUsers: 45,
        newUserSignups: 12,
        returningUsers: 33,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivity,
      });

      const result = await analyticsApi.getUserActivity();
      
      expect(result).toEqual(mockActivity);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/analytics/user-activity',
        expect.any(Object)
      );
    });
  });

  describe('getTopProducts', () => {
    it('should fetch top products with default limit', async () => {
      const mockProducts = [
        { id: '1', name: 'Hardcover Photo Book', sales: 25 },
        { id: '2', name: 'Softcover Photo Book', sales: 18 },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await analyticsApi.getTopProducts();
      
      expect(result).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/analytics/top-products?limit=5',
        expect.any(Object)
      );
    });

    it('should fetch top products with specified limit', async () => {
      const mockProducts = [
        { id: '1', name: 'Hardcover Photo Book', sales: 25 },
        { id: '2', name: 'Softcover Photo Book', sales: 18 },
        { id: '3', name: 'Layflat Photo Book', sales: 15 },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await analyticsApi.getTopProducts(3);
      
      expect(result).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/analytics/top-products?limit=3',
        expect.any(Object)
      );
    });
  });

  describe('getOrderStats', () => {
    it('should fetch order statistics', async () => {
      const mockOrderStats = {
        totalOrders: 120,
        pendingOrders: 15,
        processingOrders: 25,
        shippedOrders: 45,
        deliveredOrders: 35,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrderStats,
      });

      const result = await analyticsApi.getOrderStats();
      
      expect(result).toEqual(mockOrderStats);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/analytics/orders',
        expect.any(Object)
      );
    });
  });
});