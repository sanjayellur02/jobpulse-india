import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <AlertCircle className="w-24 h-24 text-red-600 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-2xl font-semibold text-gray-700">Page Not Found</p>
        </div>

        {/* Description */}
        <div className="mb-8 max-w-md">
          <p className="text-gray-600 text-lg mb-2">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Let's get you back on track by returning to the homepage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Additional Links */}
        <div className="mt-12 text-gray-600">
          <p className="mb-4">Other helpful links:</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/search" className="text-blue-600 hover:underline">
              Search
            </Link>
            <Link href="/profile" className="text-blue-600 hover:underline">
              Profile
            </Link>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
