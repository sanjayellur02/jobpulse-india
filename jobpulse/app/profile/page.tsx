'use client';

import { Edit, Mail, Phone, MapPin, Briefcase, Award, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/providers';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Profile unavailable</h1>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Link href="/auth/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

          {/* Profile Info */}
          <div className="px-6 py-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex-1">
                {/* Avatar */}
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 -mt-16 mb-4 border-4 border-white">
                  {user.full_name.split(' ').map((n) => n[0]).join('')}
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.full_name}</h1>
                <p className="text-gray-600 mb-4">{user.job_role || 'Active JobPulse member'}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} />
                      {user.phone}
                    </div>
                  )}
                  {(user.city || user.state) && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      {[user.city, user.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/profile/edit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold"
                >
                  <Edit size={18} />
                  Edit Profile
                </Link>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award size={24} />
            Education
          </h2>
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {user.degree || 'Education not added'}{user.branch ? ` in ${user.branch}` : ''}
            </h3>
            <p className="text-gray-600">{user.college || 'College not added'}</p>
            <p className="text-sm text-gray-500">
              {user.passout_year ? `Passed: ${user.passout_year}` : 'Passout year not added'}
              {user.percentage ? ` | CGPA: ${user.percentage}` : ''}
            </p>
          </div>
        </div>

        {/* Employment Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase size={24} />
            Employment
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <p className="text-xl font-bold text-green-600">{user.employment_status || 'Not added'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Company</label>
              <p className="text-xl font-bold text-gray-800">{user.company_name || 'Not added'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Position</label>
              <p className="text-xl font-bold text-gray-800">{user.job_role || 'Not added'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Salary Range</label>
              <p className="text-xl font-bold text-gray-800">{user.salary_range || 'Not added'}</p>
            </div>
          </div>
          <Link
            href="/employment/update"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Employment
          </Link>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(user.skills ?? []).map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
