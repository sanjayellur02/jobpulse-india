'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchUser {
  id: string;
  full_name: string;
  degree: string;
  state: string;
  employment_status: string;
  skills: string[];
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    degree: '',
    status: '',
  });
  const [results, setResults] = useState<SearchUser[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setSearched(true);
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (filters.state) params.set('state', filters.state);
      if (filters.degree) params.set('degree', filters.degree);
      if (filters.status) params.set('status', filters.status);

      const res = await fetch(`/api/search/users?${params.toString()}`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Profiles</h1>
          <p className="text-gray-600">Find and connect with users based on skills, degree, and location</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* Main Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter size={20} />
              Filters
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Search
            </button>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-4">
            <select
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All States</option>
              <option value="karnataka">Karnataka</option>
              <option value="tamil-nadu">Tamil Nadu</option>
              <option value="maharashtra">Maharashtra</option>
            </select>

            <select
              value={filters.degree}
              onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Degrees</option>
              <option value="btech">B.Tech</option>
              <option value="bca">BCA</option>
              <option value="mtech">M.Tech</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {searched && (
          <div>
            <p className="text-gray-600 mb-6">Found {results.length} results</p>
            <div className="space-y-4">
              {results.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
                      <p className="text-gray-600">{user.degree} from {user.state}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold ${
                      user.employment_status === 'Employed'
                        ? 'bg-green-100 text-green-800'
                        : user.employment_status === 'Unemployed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.employment_status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">Use the search bar to find profiles</p>
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">Searching profiles...</p>
          </div>
        )}
      </div>
    </div>
  );
}
