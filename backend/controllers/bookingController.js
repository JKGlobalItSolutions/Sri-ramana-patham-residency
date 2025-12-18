const mongoose = require('mongoose');
const moment = require('moment');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { 
      roomId, 
      checkInDate, 
      checkOutDate, 
      guestDetails, 
      specialRequests, 
      preferences,
      paymentMethod 
    } = req.body;

    // Validate room exists and is active
    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or not available'
      });
    }

    // Check if room is available for the dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    if (checkIn < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    // Calculate pricing
    const nights = moment(checkOut).diff(moment(checkIn), 'days');
    let totalAmount = 0;
    
    // Calculate nightly rates
    for (let i = 0; i < nights; i++) {
      const date = moment(checkIn).add(i, 'days').toDate();
      totalAmount += room.getPriceForDate(date);
    }

    const taxes = {
      cgst: Math.round(totalAmount * 0.09), // 9% CGST
      sgst: Math.round(totalAmount * 0.09), // 9% SGST
      serviceCharge: Math.round(totalAmount * 0.10), // 10% service charge
      total: 0
    };

    taxes.total = taxes.cgst + taxes.sgst + taxes.serviceCharge;
    totalAmount += taxes.total;

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      room: roomId,
      guestDetails: {
        ...guestDetails,
        totalGuests: guestDetails.totalGuests || (1 + (guestDetails.additionalGuests?.length || 0))
      },
      dates: {
        checkIn,
        checkOut,
        nights
      },
      pricing: {
        roomRate: room.basePrice,
        totalRoomCost: totalAmount - taxes.total,
        taxes,
        totalAmount,
        currency: 'INR'
      },
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      specialRequests,
      preferences,
      status: 'pending'
    });

    await booking.save();

    // Populate booking with room and user details for email
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'firstName lastName email phone')
      .populate('room', 'name type basePrice');

    // Send booking confirmation email
    try {
      await sendEmail({
        email: populatedBooking.guestDetails.primaryGuest.email,
        subject: `Booking Confirmation - ${populatedBooking.bookingReference}`,
        template: 'bookingConfirmation',
        data: {
          bookingReference: populatedBooking.bookingReference,
          guestName: `${populatedBooking.guestDetails.primaryGuest.firstName} ${populatedBooking.guestDetails.primaryGuest.lastName}`,
          checkInDate: moment(populatedBooking.dates.checkIn).format('DD MMM YYYY'),
          checkOutDate: moment(populatedBooking.dates.checkOut).format('DD MMM YYYY'),
          nights: populatedBooking.dates.nights,
          roomType: populatedBooking.room.name,
          totalGuests: populatedBooking.guestDetails.totalGuests,
          totalAmount: populatedBooking.pricing.totalAmount.toLocaleString('en-IN'),
          manageBookingUrl: `${process.env.FRONTEND_URL}/bookings/${populatedBooking._id}`
        }
      });

      // Mark notification as sent
      booking.notifications.push({
        type: 'booking_confirmation',
        sent: true,
        sentAt: new Date(),
        method: 'email'
      });
      await booking.save();

    } catch (emailError) {
      console.error('Booking confirmation email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          id: booking._id,
          bookingReference: booking.bookingReference,
          status: booking.status,
          totalAmount: booking.pricing.totalAmount,
          checkInDate: booking.dates.checkIn,
          checkOutDate: booking.dates.checkOut
        }
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during booking creation'
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('room', 'name type images capacity.basePrice')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single booking details
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('room');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id).populate('room');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this time'
      });
    }

    // Calculate refund
    const refundAmount = booking.calculateRefund();
    const cancellationFee = booking.pricing.totalAmount - refundAmount;

    // Update booking
    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy: req.user.role === 'admin' ? 'hotel' : 'customer',
      reason: reason || 'Cancelled by customer',
      cancelledAt: new Date(),
      refundAmount,
      cancellationFee
    };

    await booking.save();

    // Send cancellation email
    try {
      const user = await User.findById(booking.user);
      await sendEmail({
        email: user.email,
        subject: `Booking Cancelled - ${booking.bookingReference}`,
        template: 'bookingCancellation',
        data: {
          bookingReference: booking.bookingReference,
          guestName: `${user.firstName} ${user.lastName}`,
          checkInDate: moment(booking.dates.checkIn).format('DD MMM YYYY'),
          roomType: booking.room.name,
          cancellationReason: reason || 'Cancelled by customer',
          refundAmount
        }
      });

      // Mark notification as sent
      booking.notifications.push({
        type: 'cancellation',
        sent: true,
        sentAt: new Date(),
        method: 'email'
      });
      await booking.save();

    } catch (emailError) {
      console.error('Cancellation email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        refundAmount,
        cancellationFee,
        booking: {
          id: booking._id,
          bookingReference: booking.bookingReference,
          status: booking.status
        }
      }
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during cancellation'
    });
  }
};

// Update booking payment status (for admin/webhooks)
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionId, gatewayTransactionId } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update payment status
    booking.payment.status = status;
    if (transactionId) booking.payment.transactionId = transactionId;
    if (gatewayTransactionId) booking.payment.gatewayTransactionId = gatewayTransactionId;
    
    if (status === 'completed') {
      booking.payment.paymentDate = new Date();
      booking.status = 'confirmed';
    } else if (status === 'failed') {
      booking.status = 'cancelled';
    }

    await booking.save();

    // Send payment confirmation email
    if (status === 'completed') {
      try {
        const user = await User.findById(booking.user);
        await sendEmail({
          email: user.email,
          subject: `Payment Confirmed - ${booking.bookingReference}`,
          template: 'bookingConfirmation',
          data: {
            bookingReference: booking.bookingReference,
            guestName: `${user.firstName} ${user.lastName}`,
            checkInDate: moment(booking.dates.checkIn).format('DD MMM YYYY'),
            checkOutDate: moment(booking.dates.checkOut).format('DD MMM YYYY'),
            nights: booking.dates.nights,
            roomType: booking.room.name,
            totalGuests: booking.guestDetails.totalGuests,
            totalAmount: booking.pricing.totalAmount.toLocaleString('en-IN'),
            manageBookingUrl: `${process.env.FRONTEND_URL}/bookings/${booking._id}`
          }
        });

        booking.notifications.push({
          type: 'payment_received',
          sent: true,
          sentAt: new Date(),
          method: 'email'
        });
        await booking.save();

      } catch (emailError) {
        console.error('Payment confirmation email failed:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: {
        booking: {
          id: booking._id,
          bookingReference: booking.bookingReference,
          paymentStatus: booking.payment.status,
          status: booking.status
        }
      }
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check room availability
const checkAvailability = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, guests = 1, roomType } = req.query;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Build query
    const query = {
      isActive: true,
      'capacity.maxGuests': { $gte: parseInt(guests) }
    };

    if (roomType) {
      query.type = roomType;
    }

    const rooms = await Room.find(query);

    // Filter available rooms
    const availableRooms = rooms.filter(room => {
      return room.checkAvailability(checkIn, checkOut);
    });

    // Add pricing information
    const roomsWithPricing = availableRooms.map(room => {
      const nights = moment(checkOut).diff(moment(checkIn), 'days');
      let totalPrice = 0;

      for (let i = 0; i < nights; i++) {
        const date = moment(checkIn).add(i, 'days').toDate();
        totalPrice += room.getPriceForDate(date);
      }

      return {
        id: room._id,
        name: room.name,
        type: room.type,
        description: room.description,
        capacity: room.capacity,
        amenities: room.amenities,
        images: room.images,
        basePrice: room.basePrice,
        totalPrice,
        averagePrice: Math.round(totalPrice / nights),
        nights
      };
    });

    res.json({
      success: true,
      data: {
        availableRooms: roomsWithPricing,
        searchCriteria: {
          checkInDate,
          checkOutDate,
          guests: parseInt(guests),
          roomType
        }
      }
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get booking analytics (admin only)
const getBookingAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          averageBookingValue: { $avg: '$pricing.totalAmount' }
        }
      }
    ]);

    const roomTypeAnalytics = await Booking.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomDetails'
        }
      },
      { $unwind: '$roomDetails' },
      {
        $group: {
          _id: '$roomDetails.type',
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: analytics[0] || {
          totalBookings: 0,
          confirmedBookings: 0,
          cancelledBookings: 0,
          totalRevenue: 0,
          averageBookingValue: 0
        },
        roomTypeBreakdown: roomTypeAnalytics
      }
    });

  } catch (error) {
    console.error('Get booking analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updatePaymentStatus,
  checkAvailability,
  getBookingAnalytics
};
