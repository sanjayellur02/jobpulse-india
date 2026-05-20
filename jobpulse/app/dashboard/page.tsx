'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { Users, TrendingUp, Briefcase, BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type AnalyticsData = {
  total_users: number;
  total_unemployed: number;
  total_employed: number;
  total_internship: number;
  total_freelancing: number;
  total_part_time: number;
  employment_rate: number;
};

type DegreeAnalytics = {
  degree: string;
  total_users: number;
};

type SkillAnalytics = {
  skill: string;
  count: number;
};

type StateAnalytics = {
  state: string;
  total: number;
  employed: number;
  employment_rate: string;
};

const STATUS_COLORS = ['#2563eb', '#dc2626', '#d97706', '#7c3aed', '#0891b2'];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_users: 0,
    total_unemployed: 0,
    total_employed: 0,
    total_internship: 0,
    total_freelancing: 0,
    total_part_time: 0,
    employment_rate: 0,
  });
  const [degreeData, setDegreeData] = useState<DegreeAnalytics[]>([]);
  const [topSkills, setTopSkills] = useState<SkillAnalytics[]>([]);
  const [topStates, setTopStates] = useState<StateAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [globalRes, degreeRes, skillsRes, stateRes] = await Promise.all([
          fetch('/api/analytics/global'),
          fetch('/api/analytics/degree'),
          fetch('/api/analytics/skills'),
          fetch('/api/analytics/state'),
        ]);

        if (globalRes.ok) {
          const data = await globalRes.json();
          setAnalytics({
            total_users: data.total_users || 0,
            total_unemployed: data.total_unemployed || 0,
            total_employed: data.total_employed || 0,
            total_internship: data.total_internship || 0,
            total_freelancing: data.total_freelancing || 0,
            total_part_time: data.total_part_time || 0,
            employment_rate: data.employment_rate || 0,
          });
        }

        if (degreeRes.ok) {
          const data = await degreeRes.json();
          setDegreeData((data.degree_data ?? []).slice(0, 8));
        }

        if (skillsRes.ok) {
          const data = await skillsRes.json();
          setTopSkills((data.top_skills ?? []).slice(0, 5));
        }

        if (stateRes.ok) {
          const data = await stateRes.json();
          setTopStates(
            (data.state_data ?? [])
              .map((item: StateAnalytics) => ({
                ...item,
                employment_rate: item.employment_rate || '0',
              }))
              .sort((a: StateAnalytics, b: StateAnalytics) => {
                const aUnemployment = 100 - Number(a.employment_rate || 0);
                const bUnemployment = 100 - Number(b.employment_rate || 0);
                return bUnemployment - aUnemployment;
              })
              .slice(0, 5)
          );
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statusData = [
    { name: 'Employed', value: analytics.total_employed },
    { name: 'Unemployed', value: analytics.total_unemployed },
    { name: 'Internship', value: analytics.total_internship },
    { name: 'Freelancing', value: analytics.total_freelancing },
    { name: 'Part-time', value: analytics.total_part_time },
  ].filter((item) => item.value > 0);

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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time unemployment statistics and employment analytics</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Registered Users" value={analytics.total_users} icon={<Users size={24} />} description="Profiles in JobPulse" />
          <StatCard title="Total Unemployed" value={analytics.total_unemployed} icon={<BarChart3 size={24} />} description="Active job seekers" />
          <StatCard title="Total Employed" value={analytics.total_employed} icon={<Briefcase size={24} />} description="Reported as employed" />
          <StatCard title="Employment Rate" value={`${analytics.employment_rate}%`} icon={<TrendingUp size={24} />} description="Across all users" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Employment Status Distribution</h2>
            <div className="h-64">
              {statusData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={88} label>
                      {statusData.map((entry, index) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No employment data yet</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Degree Distribution</h2>
            <div className="h-64">
              {degreeData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={degreeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="degree" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total_users" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No degree data yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 States by Unemployment</h2>
            <div className="space-y-3">
              {topStates.length ? (
                topStates.map((item) => {
                  const unemploymentRate = 100 - Number(item.employment_rate || 0);
                  return (
                    <div key={item.state} className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-700">{item.state}</span>
                      <span className="font-bold text-red-600">{unemploymentRate.toFixed(1)}%</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No state data yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 In-Demand Skills</h2>
            <div className="space-y-3">
              {topSkills.length ? (
                topSkills.map((item) => (
                  <div key={item.skill} className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">{item.skill}</span>
                    <span className="font-bold text-blue-600">{item.count.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No skills data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
