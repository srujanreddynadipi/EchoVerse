# EchoVerse Authentication System

## Overview
EchoVerse now includes a complete user authentication system with registration, login, and user management capabilities.

## Features

### 🔐 Authentication
- **User Registration**: Multi-step registration with basic info and student details
- **Secure Login**: Email/password authentication with bcrypt hashing
- **Session Management**: Automatic login state persistence using localStorage
- **Logout**: Secure logout with session cleanup

### 👤 User Management
- **User Profiles**: Complete student profile management
- **Database Integration**: All user data stored in MySQL database
- **Real-time Updates**: Profile changes sync with database

### 🛡️ Security
- **Password Hashing**: bcrypt with salt for secure password storage
- **Input Validation**: Both frontend and backend validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Protection**: Configured for React frontend

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    date_of_birth DATE,
    university VARCHAR(200),
    course VARCHAR(200),
    year VARCHAR(20),
    roll_number VARCHAR(50),
    gpa DECIMAL(3,2),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Registration
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "location": "City, Country",
  "university": "University Name",
  "course": "Computer Science",
  "year": "3rd Year",
  "roll_number": "CS2021001",
  "gpa": 3.8,
  "bio": "Student bio..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Get User Profile
```http
GET /auth/me?user_id=123
```

## Frontend Components

### 🔑 LoginPage
- Email/password authentication
- Password visibility toggle
- Error handling and loading states
- Responsive design with glassmorphism UI

### 📝 RegisterPage
- Two-step registration process
- Step 1: Basic info (name, email, password)
- Step 2: Student details (optional)
- Form validation and error handling
- Progress indicator

### 🔄 AuthWrapper
- Manages authentication state
- Handles login/logout functionality
- Session persistence
- Automatic user state restoration

### 🍔 Updated Components
- **Hamburger Menu**: Now shows user info and logout button
- **ProfilePage**: Displays real user data from database
- **EchoVerse**: Accepts user props and logout functionality

## Usage Instructions

### For Development
1. **Start Backend**:
   ```bash
   cd backend
   python app.py
   ```

2. **Start Frontend**:
   ```bash
   npm start
   ```

3. **Visit Application**:
   - Navigate to `http://localhost:3002`
   - You'll see the login page first

### First Time Setup
1. **Database Migration**: 
   ```bash
   cd backend
   python migrate_auth.py
   ```

2. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Testing Authentication
```bash
python test_auth.py
```

## User Flow

1. **New User**:
   - Visit app → Login page appears
   - Click "Create Account" → Registration form
   - Fill Step 1 (required) → Next
   - Fill Step 2 (optional) → Create Account
   - Automatically logged in → Main app

2. **Returning User**:
   - Visit app → Login page appears
   - Enter email/password → Sign In
   - Redirected to main app

3. **Logout**:
   - Click hamburger menu (top-left)
   - Click "Logout" button
   - Redirected to login page

## Data Storage

### Frontend (localStorage)
- `user`: Complete user object (without password)
- `isLoggedIn`: Boolean flag for auth state

### Backend (MySQL)
- User profiles in `users` table
- Audio history linked to user accounts
- Secure password hashing with bcrypt

## Security Best Practices

✅ **Implemented**:
- Password hashing with bcrypt
- Input validation on both frontend/backend
- SQL injection protection
- CORS configuration
- Session management
- Error handling without information leakage

🔒 **Additional Recommendations** (for production):
- JWT tokens for stateless authentication
- Rate limiting for login attempts
- Email verification for new accounts
- Password reset functionality
- HTTPS enforcement
- Environment variable protection

## Files Created/Modified

### New Files
- `src/components/LoginPage.js`
- `src/components/RegisterPage.js`
- `src/components/AuthWrapper.js`
- `backend/migrate_auth.py`
- `test_auth.py`

### Modified Files
- `src/App.js` → Uses AuthWrapper
- `src/EchoVerse.js` → Accepts user props
- `src/components/Hamburger.js` → Shows user info and logout
- `src/components/ProfilePage.js` → Uses real user data
- `backend/app.py` → Added auth endpoints
- `backend/database_manager.py` → Added auth methods
- `backend/requirements.txt` → Added bcrypt
- `backend/database/schema_mysql.sql` → Added auth fields

## Troubleshooting

### Common Issues
1. **"User already exists"**: Use different email or try logging in
2. **"Database connection failed"**: Check MySQL server and credentials
3. **"Invalid email or password"**: Verify credentials are correct
4. **Page not loading**: Ensure both backend (port 5000) and frontend (port 3002) are running

### Debug Commands
```bash
# Test backend health
curl http://localhost:5000/health

# Test auth endpoints
python test_auth.py

# Check database migration
python migrate_auth.py
```

## Next Steps

🚀 **Ready Features**:
- User registration and login ✅
- Database integration ✅  
- Session management ✅
- User profiles ✅

🔄 **Future Enhancements**:
- Email verification
- Password reset via email
- Social login (Google, GitHub)
- Two-factor authentication
- Admin dashboard
- User roles and permissions

---

Your EchoVerse application now has a complete authentication system! Users can register, login, and manage their profiles while all data is securely stored in the MySQL database.
