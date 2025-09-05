import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
        <Link href="/" className="text-xl font-bold text-blue-600">
          PhotoBook Creator
        </Link>
        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Back to home
        </Link>
      </div>
      <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}