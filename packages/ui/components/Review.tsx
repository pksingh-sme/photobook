import React from 'react';

interface ReviewProps {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
  rating: number;
  title: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  // Add functions for handling actions
  onEdit?: (review: any) => void;
  onDelete?: (id: string) => void;
  onMarkHelpful?: (id: string) => void;
  currentUser?: any;
}

export const Review: React.FC<ReviewProps> = ({
  id,
  user,
  rating,
  title,
  comment,
  isVerifiedPurchase,
  helpfulCount,
  createdAt,
  currentUser,
  onEdit,
  onDelete,
  onMarkHelpful,
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const canEdit = currentUser && currentUser.id === userId;
  const canDelete = currentUser && currentUser.id === userId;

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((star) => (
                  <svg
                    key={star}
                    className={`h-4 w-4 ${star < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center mt-1">
                <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
                {isVerifiedPurchase && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
            {(canEdit || canDelete) && (
              <div className="flex space-x-2">
                {canEdit && onEdit && (
                  <button
                    onClick={() => onEdit({
                      id,
                      userId,
                      user,
                      rating,
                      title,
                      comment,
                      isVerifiedPurchase,
                      helpfulCount,
                      createdAt,
                      updatedAt: createdAt,
                    })}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
                {canDelete && onDelete && (
                  <button
                    onClick={() => onDelete(id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h5 className="font-medium text-gray-900">{title}</h5>
        {comment && <p className="mt-1 text-gray-700">{comment}</p>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        {helpfulCount > 0 && (
          <div className="text-sm text-gray-500">
            {helpfulCount} {helpfulCount === 1 ? 'person' : 'people'} found this helpful
          </div>
        )}
        {currentUser && currentUser.id !== userId && onMarkHelpful && (
          <button
            onClick={() => onMarkHelpful(id)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Helpful
          </button>
        )}
      </div>
    </div>
  );
};