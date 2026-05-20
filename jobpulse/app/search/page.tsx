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
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const handleSearch = async (targetPage = 0) => {
    setSearched(true);
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (filters.state) params.set('state', filters.state);
      if (filters.degree) params.set('degree', filters.degree);
      if (filters.status) params.set('status', filters.status);
      params.set('page', String(targetPage));

      const res = await fetch(`/api/search/users?${params.toString()}`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.users ?? []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? targetPage);
      setPageSize(data.pageSize ?? 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canGoBack = page > 0 && !loading;
  const canGoNext = page + 1 < totalPages && !loading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Profiles</h1>
          <p className="text-gray-600">Find and connect with users based on skills, degree, and location</p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch(0);
          }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
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
              type="submit"
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
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>

            <select
              value={filters.degree}
              onChange={(e) => setFilters({ ...filters, degree: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Degrees</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.E.">B.E.</option>
              <option value="B.Sc">B.Sc</option>
              <option value="B.A">B.A</option>
              <option value="B.Com">B.Com</option>
              <option value="Diploma">Diploma</option>
              <option value="ITI">ITI</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Employed">Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Internship">Internship</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </form>

        {/* Results */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {searched && (
          <div>
            <p className="text-gray-600 mb-6">
              Found {total.toLocaleString()} result{total === 1 ? '' : 's'}
            </p>

            {results.length ? (
              <>
                <div className="space-y-4">
                  {results.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
                          <p className="text-gray-600">{user.degree || 'Degree not added'} from {user.state || 'State not added'}</p>
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
                          {(user.skills ?? []).length ? (
                            user.skills.map((skill) => (
                              <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No skills added</span>
                          )}
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={!canGoBack}
                    onClick={() => handleSearch(page - 1)}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => handleSearch(page + 1)}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              !loading && (
                <div className="bg-white rounded-lg shadow-md p-10 text-center text-gray-600">
                  <p className="text-xl font-semibold text-gray-800 mb-2">No matching profiles found</p>
                  <p>Try a broader keyword or remove one of the filters.</p>
                </div>
              )
            )}
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
