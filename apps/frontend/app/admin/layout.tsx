import { Navigation } from '@ui/Navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
}