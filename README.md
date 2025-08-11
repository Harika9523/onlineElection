# Digital Voting System for Students

A comprehensive digital voting platform designed for campus elections, built with Node.js, React, and MongoDB Atlas.

## Features

### For Students
- **User Registration & Authentication**: Secure student registration with verification system
- **Election Participation**: View and participate in active elections
- **Voting Interface**: Clean and intuitive voting experience
- **Voting History**: Track your voting participation
- **Real-time Results**: View election results (when available)

### For Administrators
- **User Management**: Verify student accounts and manage user data
- **Election Management**: Create, edit, and manage elections
- **Candidate Management**: Add and approve candidates for elections
- **Vote Monitoring**: Real-time vote tracking and statistics
- **Results Management**: Control when results are visible to students

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **React Icons** - Icon library
- **Chart.js** - Data visualization

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd digital-voting-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### Development Mode

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5001`

2. **Start Frontend Development Server**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Start Production Server**
```bash
cd backend
npm start
```

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'student']),
  studentId: String (unique),
  university: String,
  department: String,
  year: Number,
  isVerified: Boolean,
  hasVoted: Boolean,
  createdAt: Date
}
```

### Elections Collection
```javascript
{
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  isCompleted: Boolean,
  totalVotes: Number,
  createdBy: ObjectId (ref: User),
  allowedDepartments: [String],
  allowedYears: [Number],
  createdAt: Date
}
```

### Candidates Collection
```javascript
{
  name: String,
  studentId: String (unique),
  email: String,
  department: String,
  year: Number,
  position: String,
  manifesto: String,
  image: String,
  election: ObjectId (ref: Election),
  voteCount: Number,
  isApproved: Boolean,
  createdAt: Date
}
```

### Votes Collection
```javascript
{
  voter: ObjectId (ref: User),
  candidate: ObjectId (ref: Candidate),
  election: ObjectId (ref: Election),
  position: String,
  votedAt: Date,
  ipAddress: String,
  userAgent: String
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/verify/:userId` - Verify user (admin only)

### Elections
- `POST /api/elections` - Create election (admin only)
- `GET /api/elections` - Get all elections (admin only)
- `GET /api/elections/active` - Get active elections
- `GET /api/elections/:id` - Get single election
- `PUT /api/elections/:id` - Update election (admin only)
- `PUT /api/elections/:id/toggle` - Toggle election status (admin only)
- `PUT /api/elections/:id/complete` - Complete election (admin only)
- `DELETE /api/elections/:id` - Delete election (admin only)

### Candidates
- `POST /api/candidates` - Create candidate (admin only)
- `GET /api/candidates` - Get all candidates (admin only)
- `GET /api/candidates/election/:electionId` - Get candidates by election
- `GET /api/candidates/:id` - Get single candidate
- `PUT /api/candidates/:id` - Update candidate (admin only)
- `PUT /api/candidates/:id/approve` - Approve candidate (admin only)
- `DELETE /api/candidates/:id` - Delete candidate (admin only)

### Votes
- `POST /api/votes/cast` - Cast vote
- `GET /api/votes/history` - Get user voting history
- `GET /api/votes/results/:electionId` - Get election results
- `GET /api/votes` - Get all votes (admin only)
- `GET /api/votes/statistics/:electionId` - Get vote statistics (admin only)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-based Access Control**: Admin and student roles
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing configuration
- **Rate Limiting**: Protection against brute force attacks

## Usage Guide

### For Administrators

1. **Create Admin Account**
   - Register with admin role or modify existing user in database
   - Login to access admin dashboard

2. **Manage Users**
   - View all registered students
   - Verify student accounts
   - Monitor user activity

3. **Create Elections**
   - Set election title and description
   - Configure start and end dates
   - Specify allowed departments and years
   - Activate elections when ready

4. **Manage Candidates**
   - Add candidates for elections
   - Review and approve candidate applications
   - Monitor candidate information

5. **Monitor Voting**
   - Track real-time voting statistics
   - View detailed vote breakdowns
   - Control result visibility

### For Students

1. **Registration**
   - Register with student information
   - Wait for admin verification
   - Login once verified

2. **Participate in Elections**
   - View active elections
   - Read candidate information
   - Cast your vote securely

3. **Track Activity**
   - View voting history
   - Check election results
   - Monitor account status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Future Enhancements

- Real-time notifications
- Email verification system
- Advanced analytics dashboard
- Mobile application
- Multi-language support
- Blockchain integration for enhanced security
- Social media integration
- Advanced reporting features
