import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUsers
} from 'react-icons/fa';

const ManageElections = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allowedDepartments: [],
    allowedYears: []
  });

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Business Administration',
    'Economics',
    'Psychology',
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'English',
    'History',
    'Political Science',
    'All Departments'
  ];

  const years = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/elections');
      setElections(response.data);
    } catch (error) {
      setError('Failed to load elections');
      console.error('Manage elections error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingElection) {
        await axiosInstance.put(`/elections/${editingElection._id}`, formData);
      } else {
        await axiosInstance.post('/elections', formData);
      }
      setShowForm(false);
      setEditingElection(null);
      resetForm();
      fetchElections();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save election');
    }
  };

  const handleEdit = (election) => {
    setEditingElection(election);
    setFormData({
      title: election.title,
      description: election.description,
      startDate: new Date(election.startDate).toISOString().split('T')[0],
      endDate: new Date(election.endDate).toISOString().split('T')[0],
      allowedDepartments: election.allowedDepartments,
      allowedYears: election.allowedYears
    });
    setShowForm(true);
  };

  const handleDelete = async (electionId) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      try {
        await axiosInstance.delete(`/elections/${electionId}`);
        fetchElections();
      } catch (error) {
        setError('Failed to delete election');
      }
    }
  };

  const handleToggleStatus = async (electionId) => {
    try {
      await axiosInstance.put(`/elections/${electionId}/toggle`);
      fetchElections();
    } catch (error) {
      setError('Failed to toggle election status');
    }
  };

  const handleComplete = async (electionId) => {
    if (window.confirm('Are you sure you want to complete this election?')) {
      try {
        await axiosInstance.put(`/elections/${electionId}/complete`);
        fetchElections();
      } catch (error) {
        setError('Failed to complete election');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      allowedDepartments: [],
      allowedYears: []
    });
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (election.isCompleted) {
      return { status: 'completed', text: 'Completed', color: 'bg-gray-100 text-gray-800' };
    } else if (!election.isActive) {
      return { status: 'inactive', text: 'Inactive', color: 'bg-red-100 text-red-800' };
    } else if (now < startDate) {
      return { status: 'upcoming', text: 'Upcoming', color: 'bg-yellow-100 text-yellow-800' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'active', text: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'ended', text: 'Ended', color: 'bg-blue-100 text-blue-800' };
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Elections</h1>
            <p className="mt-2 text-gray-600">Create and manage campus elections</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingElection(null);
              resetForm();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            New Election
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Election Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingElection ? 'Edit Election' : 'Create New Election'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Election Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Departments
                  </label>
                  <select
                    multiple
                    value={formData.allowedDepartments}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      allowedDepartments: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Years
                  </label>
                  <select
                    multiple
                    value={formData.allowedYears}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      allowedYears: Array.from(e.target.selectedOptions, option => parseInt(option.value))
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>Year {year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingElection ? 'Update Election' : 'Create Election'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingElection(null);
                    resetForm();
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Elections List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Elections</h2>
          </div>
          
          <div className="p-6">
            {elections.length === 0 ? (
              <div className="text-center py-8">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No elections</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first election to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {elections.map((election) => {
                  const status = getElectionStatus(election);
                  
                  return (
                    <div key={election._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{election.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Start: {new Date(election.startDate).toLocaleDateString()}</span>
                            <span>End: {new Date(election.endDate).toLocaleDateString()}</span>
                            <span>Votes: {election.totalVotes}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleToggleStatus(election._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              election.isActive 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title={election.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {election.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          
                          {!election.isCompleted && (
                            <button
                              onClick={() => handleComplete(election._id)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="Complete Election"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleEdit(election)}
                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                            title="Edit Election"
                          >
                            <FaEdit />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(election._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete Election"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageElections;
