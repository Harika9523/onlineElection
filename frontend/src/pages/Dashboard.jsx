import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { 
  FaVoteYea, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaUserCheck,
  FaExclamationTriangle,
  FaChartBar,
  FaHistory
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, isVerified, hasVoted } = useAuth();
  const [activeElections, setActiveElections] = useState([]);
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [electionsRes, historyRes] = await Promise.all([
        axiosInstance.get('/elections/active'),
        axiosInstance.get('/votes/history')
      ]);
      
      setActiveElections(electionsRes.data);
      setVotingHistory(historyRes.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${isVerified() ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {isVerified() ? (
                  <FaUserCheck className="h-6 w-6 text-green-600" />
                ) : (
                  <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
                <p className={`text-sm ${isVerified() ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isVerified() ? 'Verified' : 'Pending Verification'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${hasVoted() ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <FaVoteYea className={`h-6 w-6 ${hasVoted() ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Voting Status</h3>
                <p className={`text-sm ${hasVoted() ? 'text-blue-600' : 'text-gray-600'}`}>
                  {hasVoted() ? 'Vote Cast' : 'No Vote Cast'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaChartBar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Active Elections</h3>
                <p className="text-sm text-purple-600">{activeElections.length} available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Elections */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Elections</h2>
          </div>
          <div className="p-6">
            {activeElections.length === 0 ? (
              <div className="text-center py-8">
                <FaClock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active elections</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for upcoming elections.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeElections.map((election) => (
                  <div key={election._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{election.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{election.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <FaClock className="mr-1" />
                          Ends: {new Date(election.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/vote/${election._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Vote Now
                        </Link>
                        <Link
                          to={`/results/${election._id}`}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          View Results
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Voting History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Voting History</h2>
          </div>
          <div className="p-6">
            {votingHistory.length === 0 ? (
              <div className="text-center py-8">
                <FaHistory className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No voting history</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't participated in any elections yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {votingHistory.map((vote) => (
                  <div key={vote._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{vote.election.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Voted for: {vote.candidate.name} ({vote.candidate.position})
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <FaCheckCircle className="mr-1 text-green-500" />
                          Voted on: {new Date(vote.votedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-green-600">
                        <FaCheckCircle className="h-6 w-6" />
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

export default Dashboard;
