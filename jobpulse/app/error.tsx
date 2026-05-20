'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service (e.g., Sentry)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 text-orange-600 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-800 mb-2">500</h1>
          <p className="text-2xl font-semibold text-gray-700">Something went wrong</p>
        </div>

        {/* Description */}
        <div className="mb-8 max-w-md">
          <p className="text-gray-600 text-lg mb-2">
            We encountered an unexpected error while processing your request.
          </p>
          <p className="text-gray-500 text-sm mb-4">
            {error?.message || 'Please try again or contact support if the problem persists.'}
          </p>
          {error?.digest && (
            <p className="text-gray-400 text-xs font-mono bg-gray-100 p-2 rounded">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 text-gray-800 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-gray-600">
          <p className="mb-4">Need help?</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
            <Link href="/search" className="text-blue-600 hover:underline">
              Search
            </Link>
            <a href="mailto:support@jobpulseindia.com" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
