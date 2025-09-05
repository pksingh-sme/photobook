'use client';

import { useState, useEffect } from 'react';
import { Button } from '@ui/Button';
import { orderApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <Button onClick={() => router.push('/orders')} className="mt-4">Back to Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Order #{order.id.substring(0, 8)}
              </h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'DELIVERED' 
                  ? 'bg-green-100 text-green-800' 
                  : order.status === 'PROCESSING' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : order.status === 'SHIPPED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item: any) => (
                      <li key={item.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images.find((img: any) => img.isPrimary)?.url || item.product.images[0].url}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                              <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-gray-900">$5.99</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax</p>
                    <p className="text-gray-900">${(order.totalAmount * 0.08).toFixed(2)}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                    <p className="text-gray-900">Total</p>
                    <p className="text-gray-900">${(order.totalAmount + 5.99 + (order.totalAmount * 0.08)).toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                      <p className="text-gray-600">{order.shippingAddress.street}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                )}
                
                {/* Tracking */}
                {order.trackingNumber && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600">Tracking Number</p>
                      <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button onClick={() => router.push('/orders')}>
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}