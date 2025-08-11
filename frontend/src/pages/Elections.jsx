import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { 
  FaVoteYea, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaCalendarAlt,
  FaUsers,
  FaChartBar
} from 'react-icons/fa';

const Elections = () => {
  const { user, isVerified } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/elections/active');
      setElections(response.data);
    } catch (error) {
      setError('Failed to load elections');
      console.error('Elections error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) {
      return { status: 'upcoming', text: 'Upcoming', color: 'bg-yellow-100 text-yellow-800' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'active', text: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'ended', text: 'Ended', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const canVote = (election) => {
    if (!isVerified()) return false;
    const status = getElectionStatus(election);
    return status.status === 'active';
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
          <h1 className="text-3xl font-bold text-gray-900">Elections</h1>
          <p className="mt-2 text-gray-600">Participate in campus elections and make your voice heard</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Verification Notice */}
        {!isVerified() && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <FaTimesCircle className="mr-2" />
              Your account is pending verification. You will be able to vote once an administrator verifies your account.
            </div>
          </div>
        )}

        {/* Elections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FaClock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No elections available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for upcoming elections.</p>
            </div>
          ) : (
            elections.map((election) => {
              const status = getElectionStatus(election);
              const canParticipate = canVote(election);

              return (
                <div key={election._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{election.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        <span>Start: {new Date(election.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="mr-2" />
                        <span>End: {new Date(election.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUsers className="mr-2" />
                        <span>Total Votes: {election.totalVotes}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {canParticipate ? (
                        <Link
                          to={`/vote/${election._id}`}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                        >
                          <FaVoteYea className="inline mr-2" />
                          Vote Now
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed text-center font-medium"
                        >
                          {!isVerified() ? 'Account Not Verified' : 
                           status.status === 'upcoming' ? 'Not Started' : 'Voting Ended'}
                        </button>
                      )}

                      <Link
                        to={`/results/${election._id}`}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <FaChartBar className="mr-1" />
                        Results
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Participate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Get Verified</h3>
              <p className="text-sm text-gray-600">Ensure your student account is verified by an administrator</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Choose Election</h3>
              <p className="text-sm text-gray-600">Browse available elections and read candidate information</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Cast Your Vote</h3>
              <p className="text-sm text-gray-600">Vote securely and view real-time results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elections;
