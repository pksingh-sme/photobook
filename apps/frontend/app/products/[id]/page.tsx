'use client';

import { useState, useEffect } from 'react';
import { Button } from '@ui/Button';
import { Review } from '@ui/Review';
import { ReviewForm } from '@ui/ReviewForm';
import { productApi, reviewApi, authApi } from '@/lib/api';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userReview, setUserReview] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchProduct();
    fetchReviews();
  }, [params.id]);

  useEffect(() => {
    if (currentUser) {
      fetchReviews();
    }
  }, [currentUser, params.id]);

  const fetchCurrentUser = async () => {
    try {
      const user = await authApi.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProduct(params.id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await reviewApi.getReviews(params.id);
      setReviews(data);
      
      // Check if current user has already reviewed this product
      if (currentUser) {
        const userReview = data.find((review: any) => review.userId === currentUser.id);
        if (userReview) {
          setUserReview(userReview);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleReviewSubmit = async (rating: number, title: string, comment?: string) => {
    try {
      if (editingReview) {
        // Update existing review
        const updatedReview = await reviewApi.updateReview(editingReview.id, rating, title, comment);
        setReviews(reviews.map(review => review.id === editingReview.id ? updatedReview : review));
        setEditingReview(null);
      } else {
        // Create new review
        const newReview = await reviewApi.createReview(params.id, rating, title, comment);
        setReviews([newReview, ...reviews]);
        setUserReview(newReview);
      }
      setShowReviewForm(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleEditReview = (review: any) => {
    if (currentUser && review.userId === currentUser.id) {
      setEditingReview(review);
      setShowReviewForm(true);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewApi.deleteReview(reviewId);
        setReviews(reviews.filter(review => review.id !== reviewId));
        if (userReview && userReview.id === reviewId) {
          setUserReview(null);
        }
        if (editingReview && editingReview.id === reviewId) {
          setEditingReview(null);
          setShowReviewForm(false);
        }
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const updatedReview = await reviewApi.markHelpful(reviewId);
      setReviews(reviews.map(review => review.id === reviewId ? updatedReview : review));
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
      alert('Failed to mark review as helpful. Please try again.');
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
          <p className="mt-1 text-sm text-gray-500">The product you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <div className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/products" className="ml-2 text-gray-500 hover:text-gray-700">
                  Products
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-gray-700" aria-current="page">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={product.name}
                    className="w-full h-96 object-contain"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product.images.map((image: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-gray-100 rounded-md overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="flex justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  {product.category && (
                    <p className="mt-1 text-sm text-blue-600">{product.category.name}</p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>

              {/* Product Specs */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
                <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <dt className="text-sm font-medium text-gray-500">Pages</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.pages} pages</dd>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <dt className="text-sm font-medium text-gray-500">Cover Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.coverType}</dd>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <dt className="text-sm font-medium text-gray-500">Paper Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.paperType}</dd>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <dt className="text-sm font-medium text-gray-500">Production Time</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.productionTime} days</dd>
                  </div>
                </dl>
              </div>

              {/* Customization Options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Customize</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <div className="mt-1 flex items-center">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                      >
                        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 border-y border-gray-300 px-4 py-2 text-center"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                      >
                        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button className="flex-1">Add to Cart</Button>
                <Link href="/design">
                  <Button variant="outline" className="flex-1">Create Custom Design</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Customer Reviews</h2>
          </div>
          <div className="p-6">
            {showReviewForm ? (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  {editingReview ? 'Edit Your Review' : 'Write a Review'}
                </h3>
                <ReviewForm
                  productId={params.id}
                  onSubmit={handleReviewSubmit}
                  onCancel={handleCancelReview}
                  initialRating={editingReview?.rating || 0}
                  initialTitle={editingReview?.title || ''}
                  initialComment={editingReview?.comment || ''}
                  isEditing={!!editingReview}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {/* Calculate average rating */}
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 ${rating < Math.floor(reviews.reduce((acc, review) => acc + review.rating, 0) / (reviews.length || 1)) ? 'text-yellow-400' : 'text-gray-300'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-700">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowReviewForm(true)}>
                    Write a Review
                  </Button>
                </div>
                
                <div className="mt-6 space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Review 
                        key={review.id} 
                        {...review} 
                        currentUser={currentUser}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                        onMarkHelpful={handleMarkHelpful}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}