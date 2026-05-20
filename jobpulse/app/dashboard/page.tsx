'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { Users, TrendingUp, Briefcase, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  total_users: number;
  total_unemployed: number;
  total_employed: number;
  employment_rate: number;
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_users: 0,
    total_unemployed: 0,
    total_employed: 0,
    employment_rate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics data from API
    const fetchAnalytics = async () => {
      try {
        // This will be replaced with actual API call
        // const response = await fetch('/api/analytics/global');
        // const data = await response.json();
        // setAnalytics(data);

        // Mock data for now
        setAnalytics({
          total_users: 10234,
          total_unemployed: 4521,
          total_employed: 5713,
          employment_rate: 55.8,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time unemployment statistics and employment analytics</p>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Registered Users"
            value={analytics.total_users}
            icon={<Users size={24} />}
            trend={12}
            description="Growing every day"
          />
          <StatCard
            title="Total Unemployed"
            value={analytics.total_unemployed}
            icon={<BarChart3 size={24} />}
            description="Active job seekers"
          />
          <StatCard
            title="Total Employed"
            value={analytics.total_employed}
            icon={<Briefcase size={24} />}
            description="Success stories"
          />
          <StatCard
            title="Employment Rate"
            value={`${analytics.employment_rate}%`}
            icon={<TrendingUp size={24} />}
            description="Conversion rate"
          />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Employment Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Employment Status Distribution</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center text-gray-500">
                <p>Pie Chart</p>
                <p className="text-sm mt-2">(Chart placeholder - Recharts integration coming)</p>
              </div>
            </div>
          </div>

          {/* Degree Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Degree Distribution</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center text-gray-500">
                <p>Bar Chart</p>
                <p className="text-sm mt-2">(Chart placeholder - Recharts integration coming)</p>
              </div>
            </div>
          </div>
        </div>

        {/* State & Skills Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* State-wise Unemployment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 States by Unemployment</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Tamil Nadu</span>
                <span className="font-bold text-red-600">12.5%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Karnataka</span>
                <span className="font-bold text-red-600">11.8%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Maharashtra</span>
                <span className="font-bold text-red-600">10.3%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-700">Telangana</span>
                <span className="font-bold text-red-600">9.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Delhi</span>
                <span className="font-bold text-red-600">9.2%</span>
              </div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 In-Demand Skills</h2>
            <div className="space-y-3">
              {[
                { skill: 'JavaScript', count: 3421 },
                { skill: 'Python', count: 2890 },
                { skill: 'React', count: 2456 },
                { skill: 'SQL', count: 2134 },
                { skill: 'Cloud/AWS', count: 1876 },
              ].map((item) => (
                <div key={item.skill} className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-700">{item.skill}</span>
                  <span className="font-bold text-blue-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
