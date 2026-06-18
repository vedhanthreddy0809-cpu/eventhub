const router = require('express').Router();
const { createBooking, getMyBookings, getAllBookings, cancelBooking } = require('../controllers/bookingController');
const { protect, organizerOnly } = require('../middleware/authMiddleware');
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, organizerOnly, getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);
module.exports = router;