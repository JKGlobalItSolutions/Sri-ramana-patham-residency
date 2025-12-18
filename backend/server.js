require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

// Import middleware
const { errorHandler, logger } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

// Import utilities
const { verifyConnection } = require('./utils/email');

// Create Express app
const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Global rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Sanitization middleware
app.use(mongoSanitize()); // NoSQL injection prevention
app.use(xss()); // XSS protection

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Apply rate limiting
app.use(limiter);

// Custom logger middleware
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Start server only after database connection
    const server = app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT || 5000}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`Received ${signal}. Graceful shutdown...`);
      server.close(() => {
        console.log('HTTP server closed.');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize admin user
const initializeAdmin = async () => {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        phone: '0000000000',
        role: 'admin',
        isVerified: true
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Admin initialization failed:', error.message);
  }
};

// Initialize sample room data
const initializeRooms = async () => {
  try {
    const Room = require('./models/Room');
    const roomCount = await Room.countDocuments();
    
    if (roomCount === 0) {
      const sampleRooms = [
        {
          name: 'Deluxe Suite',
          type: 'Deluxe',
          description: 'Spacious deluxe suite with modern amenities, perfect for a comfortable stay near the sacred Arunachala Hill.',
          basePrice: 2500,
          capacity: {
            maxGuests: 3,
            beds: 1,
            bedType: 'King'
          },
          amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Room Service', 'Mini Fridge', 'Safe', 'Balcony', 'Garden View'],
          images: [
            {
              url: '/assets/room-deluxe.jpeg',
              caption: 'Deluxe Suite Main View',
              isPrimary: true
            },
            {
              url: '/assets/room-deluxe-2.jpeg',
              caption: 'Deluxe Suite Bedroom',
              isPrimary: false
            },
            {
              url: '/assets/room-deluxe-3.jpeg',
              caption: 'Deluxe Suite Bathroom',
              isPrimary: false
            }
          ],
          totalRooms: 5,
          floor: 2,
          size: {
            value: 450,
            unit: 'sqft'
          },
          features: ['Premium Location', 'Mountain View', 'Premium Bedding'],
          isActive: true,
          isPopular: true
        },
        {
          name: 'Standard Room',
          type: 'Standard',
          description: 'Comfortable standard room with all essential amenities for a peaceful stay.',
          basePrice: 1800,
          capacity: {
            maxGuests: 2,
            beds: 1,
            bedType: 'Double'
          },
          amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Room Service', 'Coffee Maker', 'Work Desk'],
          images: [
            {
              url: '/assets/room-standard.jpeg',
              caption: 'Standard Room Main View',
              isPrimary: true
            },
            {
              url: '/assets/room-standard-2.jpeg',
              caption: 'Standard Room Bed',
              isPrimary: false
            },
            {
              url: '/assets/room-standard-3.jpeg',
              caption: 'Standard Room View',
              isPrimary: false
            }
          ],
          totalRooms: 10,
          floor: 1,
          size: {
            value: 300,
            unit: 'sqft'
          },
          features: ['Garden View', 'Quiet Location'],
          isActive: true,
          isPopular: false
        }
      ];

      await Room.insertMany(sampleRooms);
      console.log('Sample room data initialized');
    } else {
      console.log('Room data already exists');
    }
  } catch (error) {
    console.error('Room initialization failed:', error.message);
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize admin user
    await initializeAdmin();
    
    // Initialize sample room data
    await initializeRooms();
    
    // Verify email connection
    try {
      await verifyConnection();
      console.log('Email service initialized successfully');
    } catch (emailError) {
      console.warn('Email service initialization failed:', emailError.message);
    }
    
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
