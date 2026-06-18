const jwt = require('jsonwebtoken');
const User = require('../models/User');
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'User already exists' });
    const allowed = ['attendee', 'organizer'];
    const assignedRole = allowed.includes(role) ? role : 'attendee';
    const user = await User.create({ name, email, password, role: assignedRole });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getMe = (req, res) => res.json(req.user);