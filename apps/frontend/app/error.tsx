'use client';

import { Button } from '@ui/Button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Something went wrong!
        </h1>
        <p className="mt-2 text-base text-gray-500">
          We're sorry, but something went wrong on our end. Please try again.
        </p>
        <div className="mt-6">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </div>
  );
}