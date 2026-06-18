const Booking = require('../models/Booking');
const Event = require('../models/Event');
exports.createBooking = async (req, res) => {
  const { eventId, seats } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (seats.length > event.totalSeats - event.bookedSeats)
      return res.status(400).json({ message: 'Not enough seats available' });
    const booking = await Booking.create({ user: req.user._id, event: eventId, seats, amount: seats.length * event.price });
    event.bookedSeats += seats.length;
    await event.save();
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date venue price').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email').populate('event', 'title date').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });
    booking.status = 'cancelled';
    await booking.save();
    await Event.findByIdAndUpdate(booking.event, { $inc: { bookedSeats: -booking.seats.length } });
    res.json({ message: 'Booking cancelled' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};