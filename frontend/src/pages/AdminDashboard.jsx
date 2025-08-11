import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { 
  FaVoteYea, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalElections: 0,
    activeElections: 0,
    totalCandidates: 0,
    totalVotes: 0
  });
  const [recentElections, setRecentElections] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, electionsRes, candidatesRes, votesRes] = await Promise.all([
        axiosInstance.get('/auth/users'),
        axiosInstance.get('/elections'),
        axiosInstance.get('/candidates'),
        axiosInstance.get('/votes')
      ]);

      const users = usersRes.data;
      const elections = electionsRes.data;
      const candidates = candidatesRes.data;
      const votes = votesRes.data;

      setStats({
        totalUsers: users.length,
        verifiedUsers: users.filter(u => u.isVerified).length,
        totalElections: elections.length,
        activeElections: elections.filter(e => e.isActive && !e.isCompleted).length,
        totalCandidates: candidates.length,
        totalVotes: votes.length
      });

      setRecentElections(elections.slice(0, 5));
      setPendingVerifications(users.filter(u => !u.isVerified && u.role === 'student').slice(0, 5));
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Admin dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await axiosInstance.put(`/auth/verify/${userId}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500">{stats.verifiedUsers} verified</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaVoteYea className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Elections</h3>
                <p className="text-2xl font-bold text-green-600">{stats.totalElections}</p>
                <p className="text-sm text-gray-500">{stats.activeElections} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaChartBar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Candidates</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCandidates}</p>
                <p className="text-sm text-gray-500">Total registered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FaCheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Votes</h3>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalVotes}</p>
                <p className="text-sm text-gray-500">Cast votes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Pending Verifications</h3>
                <p className="text-2xl font-bold text-red-600">{pendingVerifications.length}</p>
                <p className="text-sm text-gray-500">Awaiting approval</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100">
                <FaCog className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                <div className="mt-2 space-y-2">
                  <Link
                    to="/admin/elections"
                    className="block text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Manage Elections
                  </Link>
                  <Link
                    to="/admin/users"
                    className="block text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Manage Users
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Elections */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Elections</h2>
            <Link
              to="/admin/elections"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              New Election
            </Link>
          </div>
          <div className="p-6">
            {recentElections.length === 0 ? (
              <div className="text-center py-8">
                <FaClock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No elections</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first election to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentElections.map((election) => (
                  <div key={election._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{election.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{election.description}</p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span>Created: {new Date(election.createdAt).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            election.isActive ? 'bg-green-100 text-green-800' : 
                            election.isCompleted ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {election.isActive ? 'Active' : election.isCompleted ? 'Completed' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/elections`}
                          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors text-sm"
                        >
                          Manage
                        </Link>
                        <Link
                          to={`/results/${election._id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Results
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Pending Verifications</h2>
            <Link
              to="/admin/users"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              View All Users
            </Link>
          </div>
          <div className="p-6">
            {pendingVerifications.length === 0 ? (
              <div className="text-center py-8">
                <FaUserCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
                <p className="mt-1 text-sm text-gray-500">All users are verified.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map((user) => (
                  <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span>Student ID: {user.studentId}</span>
                          <span>Department: {user.department}</span>
                          <span>Year: {user.year}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerifyUser(user._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <FaUserCheck className="mr-2" />
                          Verify
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <FaUserTimes className="mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
