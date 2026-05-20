"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, MapPin, Briefcase } from 'lucide-react';

type StateRanking = {
  rank: number;
  state: string;
  total_users: number;
  employed: number;
  unemployment_rate: number;
};

type DegreeRanking = {
  rank: number;
  degree: string;
  total_users: number;
  employed: number;
  unemployment_rate: number;
};

type StateAnalyticsRow = {
  state: string;
  total: number;
  employed: number;
  employment_rate: string;
};

type DegreeAnalyticsRow = {
  degree: string;
  total_users: number;
  employed: number;
  unemployment_rate: number;
};

export default function RankingsPage() {
  const [stateRankings, setStateRankings] = useState<StateRanking[]>([]);
  const [degreeRankings, setDegreeRankings] = useState<DegreeRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const [stateRes, degreeRes] = await Promise.all([
          fetch('/api/analytics/state', { credentials: 'include' }),
          fetch('/api/analytics/degree', { credentials: 'include' }),
        ]);

        if (stateRes.ok) {
          const data = await stateRes.json();
          setStateRankings(
            ((data.state_data ?? []) as StateAnalyticsRow[]).map((s, i) => ({
              rank: i + 1,
              state: s.state,
              total_users: s.total,
              employed: s.employed,
              unemployment_rate: Number(((100 - Number(s.employment_rate || 0))).toFixed(1)),
            }))
          );
        }

        if (degreeRes.ok) {
          const data = await degreeRes.json();
          setDegreeRankings(
            ((data.degree_data ?? []) as DegreeAnalyticsRow[]).map((d, i) => ({
              rank: i + 1,
              degree: d.degree,
              total_users: d.total_users,
              employed: d.employed,
              unemployment_rate: d.unemployment_rate,
            }))
          );
        }
      } catch (e) {
        console.error('Failed to fetch rankings', e);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading rankings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <TrendingUp size={40} className="text-blue-600" />
            Rankings & Leaderboards
          </h1>
          <p className="text-gray-600 text-lg">State-wise and degree-wise employment statistics</p>
        </div>

        {/* State Rankings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin size={28} />
              State Rankings
            </h2>
            <p className="text-blue-100 mt-1">Based on total registered users and employment rate</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">State</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Total Users</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Employed</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Unemployment Rate</th>
                </tr>
              </thead>
              <tbody>
                {stateRankings.map((item) => (
                  <tr key={item.rank} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
                        {item.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.state}</td>
                    <td className="px-6 py-4 text-gray-600">{item.total_users.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{item.employed.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        item.unemployment_rate > 35
                          ? 'bg-red-100 text-red-800'
                          : item.unemployment_rate > 25
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.unemployment_rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Degree Rankings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase size={28} />
              Degree Rankings
            </h2>
            <p className="text-purple-100 mt-1">Based on employment rate by educational degree</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Degree</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Total Users</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Employed</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Unemployment Rate</th>
                </tr>
              </thead>
              <tbody>
                {degreeRankings.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.degree}</td>
                    <td className="px-6 py-4 text-gray-600">{item.total_users.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{item.employed.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        item.unemployment_rate > 35
                          ? 'bg-red-100 text-red-800'
                          : item.unemployment_rate > 25
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.unemployment_rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">About These Rankings</h3>
          <div className="grid md:grid-cols-2 gap-6 text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">State Rankings</h4>
              <p>States are ranked based on the number of registered users and their employment rates. Higher-ranking states have more users and typically better employment opportunities.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Degree Rankings</h4>
              <p>Degrees are ranked by employment rate. This shows which educational qualifications have the highest employment success rate in India.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
