import { LoadingSpinner } from '@ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-lg text-gray-500">Loading...</p>
    </div>
  );
}