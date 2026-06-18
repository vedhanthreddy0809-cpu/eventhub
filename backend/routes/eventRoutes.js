const router = require('express').Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, organizerOnly } = require('../middleware/authMiddleware');
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, organizerOnly, createEvent);
router.put('/:id', protect, organizerOnly, updateEvent);
router.delete('/:id', protect, organizerOnly, deleteEvent);
module.exports = router;