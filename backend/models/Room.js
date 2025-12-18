const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: [100, 'Room name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['Standard', 'Deluxe', 'Suite', 'Premium']
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    maxGuests: {
      type: Number,
      required: [true, 'Maximum guests is required'],
      min: [1, 'Must accommodate at least 1 guest']
    },
    beds: {
      type: Number,
      required: [true, 'Number of beds is required'],
      min: [1, 'Must have at least 1 bed']
    },
    bedType: {
      type: String,
      enum: ['Single', 'Double', 'King', 'Queen', 'Twin'],
      required: true
    }
  },
  amenities: [{
    type: String,
    enum: [
      'Wi-Fi', 'Air Conditioning', 'TV', 'Room Service', 'Mini Fridge',
      'Coffee Maker', 'Safe', 'Balcony', 'Garden View', 'City View',
      'Bath Tub', 'Shower', 'Toiletries', 'Hair Dryer', 'Iron/Board',
      'Desk', 'Seating Area', 'Wardrobe', 'Daily Housekeeping',
      'Bike Rental', 'Laundry Service', '24/7 Front Desk'
    ]
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  availability: [{
    date: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    notes: String
  }],
  totalRooms: {
    type: Number,
    required: [true, 'Total number of rooms is required'],
    min: [1, 'Must have at least 1 room']
  },
  roomNumber: [String], // Specific room numbers if needed
  floor: {
    type: Number,
    min: 0
  },
  size: {
    value: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    }
  },
  features: [{
    type: String,
    maxlength: 50
  }],
  housekeeping: {
    cleaningTime: {
      type: Number, // in minutes
      default: 30
    },
    lastCleaned: Date,
    status: {
      type: String,
      enum: ['clean', 'dirty', 'maintenance'],
      default: 'clean'
    }
  },
  maintenance: {
    isUnderMaintenance: {
      type: Boolean,
      default: false
    },
    reason: String,
    startDate: Date,
    expectedCompletion: Date
  },
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  seo: {
    metaTitle: String,
    metaDescription: String
  },
  seasonalPricing: [{
    name: String,
    startDate: Date,
    endDate: Date,
    multiplier: {
      type: Number,
      min: 0.1,
      max: 5.0
    }
  }],
  restrictions: {
    minStay: {
      type: Number,
      default: 1,
      min: 1
    },
    maxStay: {
      type: Number,
      default: null
    },
    noCheckIn: [Date], // Specific dates when check-in is not allowed
    noCheckOut: [Date]  // Specific dates when check-out is not allowed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
roomSchema.index({ type: 1, isActive: 1 });
roomSchema.index({ basePrice: 1 });
roomSchema.index({ 'capacity.maxGuests': 1 });
roomSchema.index({ ratings.average: -1 });
roomSchema.index({ isPopular: -1, priority: -1 });
roomSchema.index({ 'availability.date': 1, 'availability.isAvailable': 1 });

// Virtual for calculating total available rooms
roomSchema.virtual('availableRooms').get(function() {
  return this.totalRooms; // Simplified - in real implementation, would check against bookings
});

// Virtual for room features count
roomSchema.virtual('amenitiesCount').get(function() {
  return this.amenities.length;
});

// Method to calculate price for specific date
roomSchema.methods.getPriceForDate = function(date) {
  const dayOfWeek = date.getDay();
  let price = this.basePrice;
  
  // Weekend pricing (25% extra)
  if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday, Saturday
    price *= 1.25;
  }
  
  // Seasonal pricing
  this.seasonalPricing.forEach(season => {
    if (date >= season.startDate && date <= season.endDate) {
      price *= season.multiplier;
    }
  });
  
  // Custom date pricing
  const customPricing = this.availability.find(
    avail => avail.date.toDateString() === date.toDateString()
  );
  if (customPricing && customPricing.price) {
    price = customPricing.price;
  }
  
  return Math.round(price);
};

// Method to check availability for date range
roomSchema.methods.checkAvailability = function(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  
  while (current < endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  for (let date of dates) {
    const availability = this.availability.find(
      avail => avail.date.toDateString() === date.toDateString()
    );
    
    if (availability && !availability.isAvailable) {
      return false;
    }
  }
  
  return true;
};

// Pre-save middleware to ensure only one primary image
roomSchema.pre('save', function(next) {
  const primaryImages = this.images.filter(img => img.isPrimary);
  if (primaryImages.length > 1) {
    this.images.forEach(img => {
      img.isPrimary = false;
    });
    if (this.images.length > 0) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);
