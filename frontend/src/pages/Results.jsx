import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { 
  FaChartBar, 
  FaTrophy, 
  FaUsers, 
  FaCalendarAlt,
  FaArrowLeft,
  FaTimesCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Results = () => {
  const { electionId } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [electionId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/votes/results/${electionId}`);
      setResults(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load results');
      console.error('Results error:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = results ? {
    labels: results.results.map(candidate => candidate.name),
    datasets: [
      {
        label: 'Votes',
        data: results.results.map(candidate => candidate.voteCount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Election Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaTimesCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Results Not Available</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaTimesCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-4">The election results are not available.</p>
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

  const winner = results.results.length > 0 ? results.results[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/elections')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Elections
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Election Results</h1>
          <p className="mt-2 text-gray-600">{results.election.title}</p>
        </div>

        {/* Winner Section */}
        {winner && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-6 mb-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FaTrophy className="text-6xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Winner</h2>
              <h3 className="text-xl font-semibold text-white mb-1">{winner.name}</h3>
              <p className="text-yellow-100 mb-2">{winner.position}</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-3 inline-block">
                <p className="text-white font-semibold">
                  {winner.voteCount} votes ({winner.percentage}%)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Votes</h3>
                <p className="text-2xl font-bold text-blue-600">{results.election.totalVotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaChartBar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Candidates</h3>
                <p className="text-2xl font-bold text-green-600">{results.results.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaCheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Status</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {results.election.isCompleted ? 'Completed' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vote Distribution</h2>
          {chartData && (
            <div className="h-96">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Detailed Results</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {results.results.map((candidate, index) => (
                <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.position} • {candidate.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{candidate.voteCount} votes</p>
                      <p className="text-sm text-gray-600">{candidate.percentage}%</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${candidate.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Election Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Election Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              <span className="font-medium text-gray-700">Total Votes Cast:</span>
              <span className="ml-2 text-gray-600">{results.election.totalVotes}</span>
            </div>
            <div className="flex items-center">
              <FaChartBar className="mr-2 text-gray-400" />
              <span className="font-medium text-gray-700">Candidates:</span>
              <span className="ml-2 text-gray-600">{results.results.length}</span>
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="mr-2 text-gray-400" />
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                results.election.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {results.election.isCompleted ? 'Completed' : 'Active'}
              </span>
            </div>
            {winner && (
              <div className="flex items-center">
                <FaTrophy className="mr-2 text-yellow-500" />
                <span className="font-medium text-gray-700">Winner:</span>
                <span className="ml-2 text-gray-600">{winner.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
