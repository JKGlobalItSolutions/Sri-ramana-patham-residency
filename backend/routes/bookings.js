const express = require('express');
const { body, query } = require('express-validator');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updatePaymentStatus,
  checkAvailability,
  getBookingAnalytics
} = require('../controllers/bookingController');
const { auth, adminAuth, guestOrAdminAuth, validate, sanitize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createBookingValidation = [
  body('roomId')
    .isMongoId()
    .withMessage('Invalid room ID'),
  body('checkInDate')
    .isISO8601()
    .withMessage('Please enter a valid check-in date')
    .toDate(),
  body('checkOutDate')
    .isISO8601()
    .withMessage('Please enter a valid check-out date')
    .toDate(),
  body('guestDetails.primaryGuest.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Primary guest first name must be between 2 and 50 characters'),
  body('guestDetails.primaryGuest.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Primary guest last name must be between 2 and 50 characters'),
  body('guestDetails.primaryGuest.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('guestDetails.primaryGuest.phone')
    .matches(/^\d{10}$/)
    .withMessage('Please enter a valid 10-digit phone number'),
  body('guestDetails.totalGuests')
    .isInt({ min: 1, max: 10 })
    .withMessage('Number of guests must be between 1 and 10'),
  body('paymentMethod')
    .isIn(['cash', 'card', 'upi', 'netbanking', 'wallets', 'bank_transfer'])
    .withMessage('Invalid payment method'),
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special requests cannot exceed 500 characters')
];

const cancelBookingValidation = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Cancellation reason cannot exceed 200 characters')
];

const availabilityValidation = [
  query('checkInDate')
    .isISO8601()
    .withMessage('Please enter a valid check-in date'),
  query('checkOutDate')
    .isISO8601()
    .withMessage('Please enter a valid check-out date'),
  query('guests')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Number of guests must be between 1 and 10'),
  query('roomType')
    .optional()
    .isIn(['Standard', 'Deluxe', 'Suite', 'Premium'])
    .withMessage('Invalid room type')
];

// Public routes
router.get('/availability',
  validate(availabilityValidation),
  checkAvailability
);

// Protected routes (customers and admins)
router.post('/',
  guestOrAdminAuth,
  sanitize,
  validate(createBookingValidation),
  createBooking
);

router.get('/my-bookings',
  guestOrAdminAuth,
  getUserBookings
);

router.get('/:id',
  guestOrAdminAuth,
  getBookingById
);

router.put('/:id/cancel',
  guestOrAdminAuth,
  sanitize,
  validate(cancelBookingValidation),
  cancelBooking
);

// Admin only routes
router.put('/:id/payment',
  adminAuth,
  sanitize,
  (req, res, next) => {
    // Additional validation for payment updates
    const { status } = req.body;
    if (!['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }
    next();
  },
  updatePaymentStatus
);

router.get('/analytics/summary',
  adminAuth,
  getBookingAnalytics
);

// Webhook route for payment gateway notifications
router.post('/webhook/payment',
  express.raw({ type: 'application/json' }), // Raw body for webhook verification
  (req, res, next) => {
    // In production, verify webhook signature here
    console.log('Payment webhook received:', req.body.toString());
    next();
  },
  updatePaymentStatus
);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Booking service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
