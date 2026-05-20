'use client';

import { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UpdateEmploymentPage() {
  const [formData, setFormData] = useState({
    employment_status: 'Employed',
    company_name: 'Tech Corp',
    job_role: 'Software Engineer',
    salary_range: '10-15 LPA',
    joined_date: '2024-06-15',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <Link href="/profile" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft size={20} />
          Back to Profile
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Employment Status</h1>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg">
            ✓ Employment status updated successfully!
          </div>
        )}

        {/* Form */}
        <form className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Employment Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Status</label>
            <select
              name="employment_status"
              value={formData.employment_status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="Unemployed">Unemployed</option>
              <option value="Internship">Internship</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Part-time">Part-time</option>
              <option value="Employed">Employed</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">Select your current employment status</p>
          </div>

          {/* Conditional Fields */}
          {formData.employment_status !== 'Unemployed' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.employment_status === 'Internship' ? 'Internship Provider' : 'Company Name'}
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Enter company/organization name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Role</label>
                <input
                  type="text"
                  name="job_role"
                  value={formData.job_role}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer, Product Manager"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date Joined</label>
                <input
                  type="date"
                  name="joined_date"
                  value={formData.joined_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.employment_status === 'Employed' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range (LPA)</label>
                  <input
                    type="text"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="e.g., 10-15, 15-20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">Enter salary range in LPA (Lakhs Per Annum)</p>
                </div>
              )}
            </>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Why Update Your Status?</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Help others track employment trends</li>
              <li>Contribute to India's unemployment statistics</li>
              <li>Update your professional profile</li>
              <li>Show your career progression</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </button>
            <Link
              href="/profile"
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-center"
            >
              Cancel
            </Link>
          </div>

          {/* Note */}
          <p className="text-sm text-gray-500 text-center">
            Your employment information helps us maintain accurate statistics and help other job seekers.
          </p>
        </form>
      </div>
    </div>
  );
}
