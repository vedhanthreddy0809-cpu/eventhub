const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  venue:       { type: String, required: true },
  category:    { type: String, required: true },
  price:       { type: Number, default: 0 },
  totalSeats:  { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  status:      { type: String, enum: ['upcoming','ongoing','completed'], default: 'upcoming' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);