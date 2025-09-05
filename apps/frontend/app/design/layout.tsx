import { Navigation } from '@ui/Navigation';

export default function DesignLayout({
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