# Employee Attendance Management System

A RESTful API for managing employee attendance with user authentication, check-in/check-out functionality, and admin reporting features.

## Features

- **User Management**
  - Employee registration with auto-generated IDs (EMP001, EMP002, etc.)
  - Role-based access (Admin/Employee)
  - Profile management (name, email, gender, birthday)
  
- **Attendance Tracking**
  - Check-in/check-out system
  - Automatic working hours calculation
  - Daily attendance records

- **Reporting**
  - View personal attendance history
  - Admin dashboard for all attendance records
  - Monthly summary reports

## Technologies Used

- **Backend**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JWT Authentication
  - Bcrypt for password hashing

- **Development Tools**
  - Postman (API testing)
  - Nodemon (development server)
  - Winston (logging)

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/auth/register` | POST | Register new user | Public |
| `/auth/login` | POST | Login user | Public |
| `/auth/me` | GET | Get current user profile | Private |

### User Management (Admin)
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/users` | GET | Get all users | Admin |
| `/users/:id` | GET | Get single user | Admin |
| `/users/:id` | PUT | Update user | Admin/Owner |
| `/users/:id` | DELETE | Delete user | Admin |
| `/users/:id/deactivate` | PUT | Deactivate user | Admin |

### Attendance
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/attendance/check-in` | POST | Check-in employee | Employee |
| `/attendance/check-out` | POST | Check-out employee | Employee |
| `/attendance/me` | GET | Get my attendance | Employee |
| `/attendance` | GET | Get all attendance (filterable) | Admin |
| `/attendance/summary` | GET | Get attendance summary | All |

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/employee-attendance-system.git

2. Install dependencies for backend:
   ```bash
   cd backend
   npm install

3. Create a .env file in the backend root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d

4. Start the backend development server:
   ```bash
   npm run dev

5. Install dependencies for frontend:
   ```bash
   cd frontend
   npm install -f

6. Start the frontend development server:
   ```bash
   npm run dev

## Docker Setup

1. Build and run the containers:
   ```bash
   docker-compose up --build

2. The API will be available at:
   ```bash
   http://localhost:5000

## Testing

1. Run unit tests:
   ```bash
   cd backend
   npm test

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For support or feature requests, please open an issue on GitHub or contact the maintainer.