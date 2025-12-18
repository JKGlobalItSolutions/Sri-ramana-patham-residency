const mongoose = require('mongoose');
const moment = require('moment');

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  guestDetails: {
    primaryGuest: {
      firstName: {
        type: String,
        required: [true, 'Primary guest first name is required']
      },
      lastName: {
        type: String,
        required: [true, 'Primary guest last name is required']
      },
      email: {
        type: String,
        required: [true, 'Primary guest email is required']
      },
      phone: {
        type: String,
        required: [true, 'Primary guest phone is required']
      },
      age: Number,
      idProof: {
        type: {
          type: String,
          enum: ['Aadhar', 'PAN', 'Passport', 'Driving License', 'Other']
        },
        number: String
      }
    },
    additionalGuests: [{
      firstName: String,
      lastName: String,
      age: Number,
      relationship: {
        type: String,
        enum: ['Spouse', 'Child', 'Parent', 'Friend', 'Relative', 'Other']
      }
    }],
    totalGuests: {
      type: Number,
      required: true,
      min: 1
    }
  },
  dates: {
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
      validate: {
        validator: function(date) {
          return date >= new Date();
        },
        message: 'Check-in date cannot be in the past'
      }
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
      validate: {
        validator: function(date) {
          return date > this.dates.checkIn;
        },
        message: 'Check-out date must be after check-in date'
      }
    },
    nights: {
      type: Number,
      required: true
    }
  },
  pricing: {
    roomRate: {
      type: Number,
      required: true,
      min: 0
    },
    totalRoomCost: {
      type: Number,
      required: true,
      min: 0
    },
    taxes: {
      cgst: {
        type: Number,
        default: 0,
        min: 0
      },
      sgst: {
        type: Number,
        default: 0,
        min: 0
      },
      igst: {
        type: Number,
        default: 0,
        min: 0
      },
      serviceCharge: {
        type: Number,
        default: 0,
        min: 0
      },
      total: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    discounts: [{
      type: {
        type: String,
        enum: ['earlyBird', 'loyalty', 'promotional', 'seasonal', 'group', 'other']
      },
      description: String,
      amount: {
        type: Number,
        min: 0
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0
    },
    balance: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'netbanking', 'wallets', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: String,
    paymentGateway: String,
    gatewayTransactionId: String,
    paymentDate: Date,
    refundDetails: {
      refundAmount: Number,
      refundDate: Date,
      refundReason: String,
      refundTransactionId: String
    }
  },
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'checked_in', 'checked_out', 
      'cancelled', 'no_show', 'refunded', 'modified'
    ],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  preferences: {
    bedType: String,
    floor: String,
    roomLocation: {
      type: String,
      enum: ['quiet', 'elevator_near', 'balcony', 'garden_view', 'city_view']
    },
    smokingPreference: {
      type: String,
      enum: ['smoking', 'non_smoking', 'no_preference'],
      default: 'no_preference'
    },
    pillowType: String,
    wakeUpCall: {
      time: String,
      phone: String
    },
    lateCheckout: {
      requested: {
        type: Boolean,
        default: false
      },
      time: String,
      charges: Number,
      approved: {
        type: Boolean,
        default: false
      }
    }
  },
  checkIn: {
    actualTime: Date,
    method: {
      type: String,
      enum: ['front_desk', 'self_checkin', 'staff_assisted']
    },
    idVerified: {
      type: Boolean,
      default: false
    },
    keyIssued: {
      type: Boolean,
      default: false
    },
    notes: String
  },
  checkOut: {
    actualTime: Date,
    method: {
      type: String,
      enum: ['front_desk', 'express_checkout', 'staff_assisted']
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String
    },
    extraCharges: [{
      description: String,
      amount: Number,
      date: Date
    }],
    finalBill: Number,
    paymentReceived: {
      type: Boolean,
      default: false
    },
    notes: String
  },
  modifications: [{
    type: {
      type: String,
      enum: ['date_change', 'room_change', 'guest_change', 'upgrade', 'downgrade']
    },
    description: String,
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    charges: Number,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['customer', 'hotel', 'system']
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number,
    cancellationFee: Number,
    refundProcessed: {
      type: Boolean,
      default: false
    }
  },
  notifications: [{
    type: {
      type: String,
      enum: ['booking_confirmation', 'payment_received', 'checkin_reminder', 'checkout_reminder', 'cancellation', 'modification']
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    method: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'push']
    },
    messageId: String
  }],
  source: {
    type: String,
    enum: ['website', 'phone', 'walk_in', 'travel_agent', 'ota', 'corporate'],
    default: 'website'
  },
  promoCode: String,
  loyaltyPoints: {
    earned: {
      type: Number,
      default: 0
    },
    used: {
      type: Number,
      default: 0
    }
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate unique booking reference
bookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const date = moment().format('YYYYMMDD');
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: moment().startOf('day').toDate(),
        $lte: moment().endOf('day').toDate()
      }
    });
    this.bookingReference = `SRP${date}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate nights on save
bookingSchema.pre('save', function(next) {
  if (this.dates.checkIn && this.dates.checkOut) {
    this.dates.nights = moment(this.dates.checkOut).diff(moment(this.dates.checkIn), 'days');
  }
  next();
});

// Update balance
bookingSchema.pre('save', function(next) {
  this.pricing.balance = this.pricing.totalAmount - this.pricing.amountPaid;
  next();
});

// Indexes
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ room: 1, 'dates.checkIn': 1, 'dates.checkOut': 1 });
bookingSchema.index({ 'dates.checkIn': 1, 'dates.checkOut': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for total nights
bookingSchema.virtual('totalNights').get(function() {
  return this.dates.nights;
});

// Virtual for guest count
bookingSchema.virtual('guestCount').get(function() {
  return 1 + (this.guestDetails.additionalGuests?.length || 0);
});

// Virtual for days until check-in
bookingSchema.virtual('daysUntilCheckIn').get(function() {
  const today = moment().startOf('day');
  const checkIn = moment(this.dates.checkIn).startOf('day');
  return checkIn.diff(today, 'days');
});

// Method to calculate refund amount based on cancellation policy
bookingSchema.methods.calculateRefund = function() {
  const now = moment();
  const checkIn = moment(this.dates.checkIn);
  const hoursUntilCheckIn = checkIn.diff(now, 'hours');
  
  // Cancellation policy: Free cancellation up to 24 hours before check-in
  if (hoursUntilCheckIn >= 24) {
    return this.pricing.totalAmount; // Full refund
  } else if (hoursUntilCheckIn >= 2) {
    return this.pricing.totalAmount * 0.5; // 50% refund
  } else {
    return 0; // No refund
  }
};

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = moment();
  const checkIn = moment(this.dates.checkIn);
  const hoursUntilCheckIn = checkIn.diff(now, 'hours');
  
  return hoursUntilCheckIn >= 2 && !['checked_in', 'checked_out'].includes(this.status);
};

// Method to generate check-in instructions
bookingSchema.methods.getCheckInInstructions = function() {
  return {
    time: '2:00 PM',
    location: 'Front Desk, Sri Ramana Padam Residency',
    requirements: [
      'Valid photo ID for all guests',
      'Booking confirmation',
      'Payment method for incidentals'
    ],
    contact: '+91-9943177729'
  };
};

module.exports = mongoose.model('Booking', bookingSchema);
