# Sri Ramana Padam Residency - Backend API

A comprehensive Node.js backend API for the Sri Ramana Padam Residency hotel booking system, built with Express.js, MongoDB, and modern security practices.

## 🏗️ Architecture Overview

### Technology Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer with SMTP support
- **Security:** Helmet, CORS, Rate Limiting, Input Sanitization
- **Validation:** Express Validator
- **Utilities:** Moment.js for date handling

### Project Structure
```
backend/
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── utils/              # Utility functions
├── emails/             # Email templates
├── uploads/            # File uploads
├── server.js           # Main server file
├── package.json        # Dependencies
└── .env               # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB 5.0 or higher
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone and navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Setup:**
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. **Configure Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ramana-padam-residency

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Email (Configure with your SMTP service)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Sri Ramana Padam Residency <info@sriramanapadam.com>

# Admin
ADMIN_EMAIL=admin@sriramanapadam.com
ADMIN_PASSWORD=AdminPass123!
```

5. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "firstName": "John", "email": "john@example.com" },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe Updated",
  "phone": "9876543210"
}
```

#### Change Password
```http
POST /auth/change-password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass456"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "NewSecurePass456"
}
```

### Booking Endpoints

#### Check Room Availability
```http
GET /bookings/availability?checkInDate=2025-12-01&checkOutDate=2025-12-03&guests=2
```

**Response:**
```json
{
  "success": true,
  "data": {
    "availableRooms": [
      {
        "id": "room_id",
        "name": "Deluxe Suite",
        "type": "Deluxe",
        "totalPrice": 7500,
        "averagePrice": 2500,
        "nights": 3
      }
    ]
  }
}
```

#### Create Booking
```http
POST /bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "roomId": "room_object_id",
  "checkInDate": "2025-12-01",
  "checkOutDate": "2025-12-03",
  "guestDetails": {
    "primaryGuest": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "totalGuests": 2
  },
  "paymentMethod": "card",
  "specialRequests": "Late check-in requested"
}
```

#### Get User Bookings
```http
GET /bookings/my-bookings?page=1&limit=10
Authorization: Bearer <jwt_token>
```

#### Get Booking Details
```http
GET /bookings/:id
Authorization: Bearer <jwt_token>
```

#### Cancel Booking
```http
PUT /bookings/:id/cancel
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

### Admin Endpoints (Admin Only)

#### Update Payment Status
```http
PUT /bookings/:id/payment
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "status": "completed",
  "transactionId": "TXN123456"
}
```

#### Get Booking Analytics
```http
GET /bookings/analytics/summary?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer <admin_jwt_token>
```

## 🗄️ Database Schema

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  role: ['customer', 'admin'],
  isVerified: Boolean,
  isActive: Boolean,
  preferences: {
    roomType: String,
    specialRequests: String,
    newsletter: Boolean
  }
}
```

### Room Model
```javascript
{
  name: String (required),
  type: ['Standard', 'Deluxe', 'Suite', 'Premium'],
  description: String (required),
  basePrice: Number (required),
  capacity: {
    maxGuests: Number,
    beds: Number,
    bedType: String
  },
  amenities: [String],
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  totalRooms: Number,
  isActive: Boolean,
  isPopular: Boolean
}
```

### Booking Model
```javascript
{
  bookingReference: String (unique, auto-generated),
  user: ObjectId (ref: User),
  room: ObjectId (ref: Room),
  guestDetails: {
    primaryGuest: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String
    },
    totalGuests: Number
  },
  dates: {
    checkIn: Date,
    checkOut: Date,
    nights: Number
  },
  pricing: {
    totalAmount: Number,
    taxes: { total: Number },
    currency: String
  },
  payment: {
    method: String,
    status: String,
    transactionId: String
  },
  status: ['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out']
}
```

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Customer/Admin)
- Password hashing with bcrypt
- Email verification system
- Password reset functionality

### Security Middleware
- **Helmet.js:** Security headers
- **CORS:** Cross-origin resource sharing
- **Rate Limiting:** Prevent abuse (100 requests/15min)
- **Input Sanitization:** XSS and NoSQL injection protection
- **Request Validation:** Express Validator for data integrity

### Rate Limiting
- Global: 100 requests per 15 minutes per IP
- Auth endpoints: Enhanced protection
- Booking endpoints: User-specific limits

## 📧 Email Notifications

### Email Templates
1. **Welcome Email:** User registration confirmation
2. **Booking Confirmation:** Booking details and instructions
3. **Booking Reminder:** Upcoming stay reminders
4. **Password Reset:** Secure password reset links
5. **Booking Cancellation:** Cancellation confirmations

### Email Configuration
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Sri Ramana Padam Residency <info@sriramanapadam.com>
```

### Custom Email Templates
Templates are located in `utils/email.js` and use HTML/CSS for professional formatting with the hotel's spiritual theme.

## 👨‍💼 Admin Features

### Admin Dashboard Capabilities
- View all bookings and analytics
- Manage room inventory
- Update payment statuses
- Cancel/modify bookings
- View revenue reports
- User management

### Default Admin Account
- **Email:** admin@sriramanapadam.com
- **Password:** AdminPass123!

**⚠️ Change these credentials in production!**

### Analytics Available
- Total bookings and revenue
- Booking status breakdown
- Room type popularity
- Monthly/yearly trends
- Guest demographics

## 🧪 Testing

### Manual Testing
1. **Health Check:**
```bash
curl http://localhost:5000/health
```

2. **Test Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPass123",
    "phone": "1234567890"
  }'
```

3. **Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Automated Testing
```bash
# Run test suite (when implemented)
npm test
```

## 🚀 Deployment

### Environment Setup
1. **Production Environment Variables:**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ramana-padam-residency
PORT=5000
JWT_SECRET=your_super_secure_production_secret
FRONTEND_URL=https://yourdomain.com
```

### Deployment Options

#### 1. Heroku
```bash
# Install Heroku CLI
heroku create ramana-padam-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
# Add other environment variables
git push heroku main
```

#### 2. DigitalOcean/AWS
```bash
# Using PM2 for process management
npm install -g pm2
pm2 start server.js --name "ramana-padam-api"
pm2 startup
pm2 save
```

#### 3. Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Change default admin credentials
- [ ] Configure proper SMTP settings
- [ ] Set strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for MongoDB
- [ ] Set up error tracking (Sentry, etc.)

## 📊 Monitoring & Logging

### Health Check Endpoint
```http
GET /health
```

Returns server status, uptime, and environment information.

### Logging
- **Development:** Morgan 'dev' format
- **Production:** Morgan 'combined' format
- **Custom Logs:** Request/response timing, errors, authentication

### Monitoring Recommendations
- **Application:** PM2, New Relic, or DataDog
- **Database:** MongoDB Atlas monitoring
- **Email:** Email delivery tracking
- **Uptime:** Pingdom, UptimeRobot

## 🔧 Configuration

### Server Configuration
- **Port:** Configurable via `PORT` environment variable
- **Database:** MongoDB connection with retry logic
- **Email:** SMTP configuration with connection testing
- **File Uploads:** Configurable size limits and file types

### Feature Flags
- Email notifications (can be disabled for testing)
- Admin initialization (can be disabled)
- Sample data initialization (can be disabled)

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when test suite is implemented)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support or questions:
- **Email:** admin@sriramanapadam.com
- **Documentation:** This README file
- **Issues:** GitHub Issues (when repository is public)

---

**Built with ❤️ for Sri Ramana Padam Residency**  
*A peaceful sanctuary near the holy Arunachala Hill*
