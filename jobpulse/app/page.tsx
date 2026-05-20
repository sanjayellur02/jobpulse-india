import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                JobPulse India
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                India's largest live unemployment transparency platform
              </p>
              <p className="text-lg text-blue-100 mb-8">
                Track your employment journey and contribute to national unemployment statistics.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
                >
                  Get Started
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  View Analytics
                </Link>
              </div>
            </div>
            <div className="bg-white/95 rounded-2xl p-8 shadow-2xl border border-white/60">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center font-bold">
                    👥
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">10,000+</p>
                    <p className="text-gray-600 text-sm">Registered Users</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center font-bold">
                    📈
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Real-time</p>
                    <p className="text-gray-600 text-sm">Analytics Updates</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center font-bold">
                    🇮🇳
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">All States</p>
                    <p className="text-gray-600 text-sm">State-wise Analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Easy Registration</h3>
              <p className="text-gray-600">
                Register your employment status with a few clicks. Share your education, skills, and current status.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Live Analytics</h3>
              <p className="text-gray-600">
                View real-time unemployment statistics, state-wise data, degree-wise analytics, and employment trends.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Track Progress</h3>
              <p className="text-gray-600">
                Update your employment status as you progress. See your journey from unemployed to employed.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Search Users</h3>
              <p className="text-gray-600">
                Search for users by name, skills, degree, state, and college. Build your network.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Leaderboards</h3>
              <p className="text-gray-600">
                See the highest unemployment states, most common degrees, and employment growth leaders.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Privacy First</h3>
              <p className="text-gray-600">
                Control your privacy. Make your profile public or anonymous. Your data is secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Help create transparency in India's youth employment. Register today and contribute to building the nation's largest live unemployment database.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
          >
            Register Now - It's Free
          </Link>
        </div>
      </section>
    </>
  );
}
