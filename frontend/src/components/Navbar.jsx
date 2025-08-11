import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaVoteYea, FaChartBar, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <FaVoteYea className="mr-2" />
          Digital Voting System
        </Link>
        
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              {/* Student Navigation */}
              {isStudent() && (
                <>
                  <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/elections" className="hover:text-blue-200 transition-colors">
                    Elections
                  </Link>
                  <Link to="/profile" className="hover:text-blue-200 transition-colors">
                    Profile
                  </Link>
                </>
              )}
              
              {/* Admin Navigation */}
              {isAdmin() && (
                <>
                  <Link to="/admin" className="hover:text-blue-200 transition-colors">
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/elections" className="hover:text-blue-200 transition-colors">
                    Manage Elections
                  </Link>
                  <Link to="/admin/candidates" className="hover:text-blue-200 transition-colors">
                    Manage Candidates
                  </Link>
                  <Link to="/admin/users" className="hover:text-blue-200 transition-colors">
                    Manage Users
                  </Link>
                </>
              )}
              
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-blue-200 text-xs">
                    {user.role === 'admin' ? 'Administrator' : 'Student'}
                    {user.role === 'student' && !user.isVerified && (
                      <span className="ml-2 text-yellow-300">(Unverified)</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
