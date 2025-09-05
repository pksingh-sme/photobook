import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response) => {
  try {
    // Get total revenue
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });
    
    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;
    
    // Get total orders
    const totalOrders = await prisma.order.count();
    
    // Get total users
    const totalUsers = await prisma.user.count();
    
    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate changes (simplified - in a real app, you'd compare to previous period)
    const revenueChange = 12.5;
    const ordersChange = 8.3;
    const usersChange = 5.7;
    const avgOrderValueChange = 3.2;
    
    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      avgOrderValue,
      revenueChange,
      ordersChange,
      usersChange,
      avgOrderValueChange,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSalesData = async (req: Request, res: Response) => {
  try {
    const { period = 'month' } = req.query;
    
    // Generate mock sales data based on period
    let salesData: { date: string; amount: number }[] = [];
    
    switch (period) {
      case 'day':
        // Last 24 hours
        for (let i = 23; i >= 0; i--) {
          const date = new Date();
          date.setHours(date.getHours() - i);
          salesData.push({
            date: date.toISOString(),
            amount: Math.floor(Math.random() * 1000) + 500,
          });
        }
        break;
        
      case 'week':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          salesData.push({
            date: date.toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 5000) + 2000,
          });
        }
        break;
        
      case 'month':
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          salesData.push({
            date: date.toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 10000) + 5000,
          });
        }
        break;
        
      case 'year':
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          salesData.push({
            date: date.toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 50000) + 20000,
          });
        }
        break;
        
      default:
        // Default to month
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          salesData.push({
            date: date.toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 10000) + 5000,
          });
        }
    }
    
    res.json(salesData);
  } catch (error) {
    console.error('Get sales data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserActivity = async (req: Request, res: Response) => {
  try {
    // Mock user activity data
    const userActivity = {
      activeUsers: Math.floor(Math.random() * 100) + 50,
      newUserSignups: Math.floor(Math.random() * 20) + 5,
      returningUsers: Math.floor(Math.random() * 80) + 30,
    };
    
    res.json(userActivity);
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 5 } = req.query;
    
    // Mock top products data
    const topProducts = [
      { id: '1', name: 'Hardcover Photo Book', sales: 125, revenue: 3750 },
      { id: '2', name: 'Softcover Photo Book', sales: 98, revenue: 2450 },
      { id: '3', name: 'Layflat Photo Book', sales: 76, revenue: 3040 },
      { id: '4', name: 'Square Photo Book', sales: 65, revenue: 1950 },
      { id: '5', name: 'Panoramic Photo Book', sales: 42, revenue: 1680 },
    ].slice(0, Number(limit));
    
    res.json(topProducts);
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderStats = async (req: Request, res: Response) => {
  try {
    // Mock order stats data
    const orderStats = {
      totalOrders: 342,
      pendingOrders: 24,
      processingOrders: 45,
      shippedOrders: 156,
      deliveredOrders: 117,
    };
    
    res.json(orderStats);
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};