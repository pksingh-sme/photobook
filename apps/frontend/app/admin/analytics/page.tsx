'use client';

import { useState, useEffect } from 'react';
import { analyticsApi } from '@/lib/analyticsApi';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, salesData, userActivityData, topProductsData, orderStatsData] = await Promise.all([
        analyticsApi.getStats(),
        analyticsApi.getSalesData(period),
        analyticsApi.getUserActivity(),
        analyticsApi.getTopProducts(),
        analyticsApi.getOrderStats(),
      ]);

      setStats(statsData);
      setSalesData(salesData);
      setUserActivity(userActivityData);
      setTopProducts(topProductsData);
      setOrderStats(orderStatsData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Render stat cards
  const renderStatCards = () => {
    if (!stats) return null;

    const statItems = [
      {
        name: 'Total Revenue',
        value: formatCurrency(stats.totalRevenue),
        change: stats.revenueChange,
        icon: (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: 'bg-green-500',
      },
      {
        name: 'Total Orders',
        value: stats.totalOrders.toLocaleString(),
        change: stats.ordersChange,
        icon: (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        color: 'bg-blue-500',
      },
      {
        name: 'Customers',
        value: stats.totalUsers.toLocaleString(),
        change: stats.usersChange,
        icon: (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        color: 'bg-purple-500',
      },
      {
        name: 'Avg. Order Value',
        value: formatCurrency(stats.avgOrderValue),
        change: stats.avgOrderValueChange,
        icon: (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        color: 'bg-yellow-500',
      },
    ];

    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <span className={stat.change >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {formatPercentage(stat.change)} from last period
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Render sales chart
  const renderSalesChart = () => {
    if (salesData.length === 0) return null;

    // Find min and max values for scaling
    const values = salesData.map(item => item.amount);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1; // Avoid division by zero

    return (
      <Card className="overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Overview</h3>
            <div className="flex space-x-2">
              <Button
                variant={period === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod('day')}
              >
                Day
              </Button>
              <Button
                variant={period === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod('week')}
              >
                Week
              </Button>
              <Button
                variant={period === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod('month')}
              >
                Month
              </Button>
              <Button
                variant={period === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod('year')}
              >
                Year
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6">
            <div className="h-64 flex items-end space-x-2">
              {salesData.map((item, index) => {
                const height = ((item.amount - minValue) / range) * 100;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`${item.date}: ${formatCurrency(item.amount)}`}
                    />
                    <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                      {period === 'day' 
                        ? new Date(item.date).toLocaleTimeString([], { hour: '2-digit' }) 
                        : period === 'week' || period === 'month'
                        ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
                        : new Date(item.date).toLocaleDateString([], { year: 'numeric', month: 'short' })
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Render top products
  const renderTopProducts = () => {
    if (topProducts.length === 0) return null;

    return (
      <Card className="overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Top Selling Products</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {topProducts.map((product, index) => (
              <li key={product.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-800 font-medium">{index + 1}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{product.sales} sold</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(product.revenue || product.sales * 29.99)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    );
  };

  // Render order status chart
  const renderOrderStatusChart = () => {
    if (!orderStats) return null;

    const statusData = [
      { name: 'Pending', value: orderStats.pendingOrders, color: 'bg-yellow-500' },
      { name: 'Processing', value: orderStats.processingOrders, color: 'bg-blue-500' },
      { name: 'Shipped', value: orderStats.shippedOrders, color: 'bg-indigo-500' },
      { name: 'Delivered', value: orderStats.deliveredOrders, color: 'bg-green-500' },
    ];

    const totalOrders = statusData.reduce((sum, item) => sum + item.value, 0);

    return (
      <Card className="overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order Status</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {statusData.map((status, index) => {
                const percentage = totalOrders > 0 ? (status.value / totalOrders) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>{status.name}</span>
                      <span>{status.value} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${status.color} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Total orders: {totalOrders.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Render user activity
  const renderUserActivity = () => {
    if (!userActivity) return null;

    return (
      <Card className="overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Activity</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-700">{userActivity.activeUsers}</div>
                <div className="text-sm text-gray-500">Active Now</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-700">{userActivity.newUserSignups}</div>
                <div className="text-sm text-gray-500">New Signups</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-700">{userActivity.returningUsers}</div>
                <div className="text-sm text-gray-500">Returning</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        {renderStatCards()}
        
        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderSalesChart()}
          </div>
          <div className="space-y-6">
            {renderUserActivity()}
            {renderOrderStatusChart()}
          </div>
        </div>
        
        {/* Top Products */}
        <div className="mt-8">
          {renderTopProducts()}
        </div>
      </main>
    </div>
  );
}