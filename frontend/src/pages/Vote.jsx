import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { 
  FaVoteYea, 
  FaUser, 
  FaGraduationCap, 
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft
} from 'react-icons/fa';

const Vote = () => {
  const { electionId } = useParams();
  const { user, isVerified } = useAuth();
  const navigate = useNavigate();
  
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchElectionData();
  }, [electionId]);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      const [electionRes, candidatesRes] = await Promise.all([
        axiosInstance.get(`/elections/${electionId}`),
        axiosInstance.get(`/candidates/election/${electionId}`)
      ]);
      
      setElection(electionRes.data);
      setCandidates(candidatesRes.data);
    } catch (error) {
      setError('Failed to load election data');
      console.error('Vote page error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate to vote for');
      return;
    }

    try {
      setVoting(true);
      setError('');
      
      await axiosInstance.post('/votes/cast', {
        candidateId: selectedCandidate._id,
        electionId: electionId
      });

      setSuccess('Your vote has been cast successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  const canVote = () => {
    if (!isVerified()) return false;
    if (!election) return false;
    
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);
    
    return now >= startDate && now <= endDate && election.isActive;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaTimesCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Election Not Found</h2>
          <p className="text-gray-600 mb-4">The election you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/elections')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/elections')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Elections
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">{election.title}</h1>
          <p className="mt-2 text-gray-600">{election.description}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              {success}
            </div>
          </div>
        )}

        {/* Verification Check */}
        {!isVerified() && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <FaTimesCircle className="mr-2" />
              Your account must be verified by an administrator before you can vote.
            </div>
          </div>
        )}

        {/* Voting Status */}
        {!canVote() && isVerified() && (
          <div className="mb-6 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <FaTimesCircle className="mr-2" />
              Voting is not currently available for this election.
            </div>
          </div>
        )}

        {/* Candidates */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Candidates</h2>
            <p className="text-sm text-gray-600 mt-1">Select a candidate to vote for</p>
          </div>
          
          <div className="p-6">
            {candidates.length === 0 ? (
              <div className="text-center py-8">
                <FaUser className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates</h3>
                <p className="mt-1 text-sm text-gray-500">No candidates have been registered for this election yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      selectedCandidate?._id === candidate._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => canVote() && setSelectedCandidate(candidate)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                        </div>
                      </div>
                      {selectedCandidate?._id === candidate._id && (
                        <FaCheckCircle className="text-blue-600 text-xl" />
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaGraduationCap className="mr-2" />
                        <span>{candidate.department} - Year {candidate.year}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>Student ID: {candidate.studentId}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Manifesto</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{candidate.manifesto}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vote Button */}
        {canVote() && candidates.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || voting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <FaVoteYea className="mr-2" />
              {voting ? 'Casting Vote...' : 'Cast Vote'}
            </button>
            {selectedCandidate && (
              <p className="mt-2 text-sm text-gray-600">
                You have selected: <span className="font-medium">{selectedCandidate.name}</span>
              </p>
            )}
          </div>
        )}

        {/* Election Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Election Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Start Date:</span>
              <span className="ml-2 text-gray-600">{new Date(election.startDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">End Date:</span>
              <span className="ml-2 text-gray-600">{new Date(election.endDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Votes:</span>
              <span className="ml-2 text-gray-600">{election.totalVotes}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                election.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {election.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
