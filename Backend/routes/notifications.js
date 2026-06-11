// routes/notifications.js
const express      = require('express');
const router       = express.Router();
const Notification = require('../models/Notification');
const Mechanic     = require('../models/Mechanic');
const User         = require('../models/User');
const { protect: authMiddleware } = require('../middleware/authMiddleware');

// All routes require auth
router.use(authMiddleware);

// ─── GET /api/notifications ───────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('booking', 'bookingId serviceType scheduledDate')
        .lean(),
      Notification.countDocuments({ recipient: req.user._id }),
      Notification.countDocuments({ recipient: req.user._id, read: false }),
    ]);

    res.json({
      notifications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      unreadCount,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// ─── GET /api/notifications/unread-count ─────────────────────────────────────
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });
    res.json({ count });
  } catch {
    res.status(500).json({ message: 'Error fetching count' });
  }
});

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────
// NOTE: must be defined BEFORE /:id routes to avoid Express matching 'read-all' as an id
router.patch('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Error marking all read' });
  }
});

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id:       req.params.id,
      recipient: req.user._id,
    });
    if (!notification) return res.status(404).json({ message: 'Not found' });

    await notification.markRead();
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Error marking read' });
  }
});

// ─── DELETE /api/notifications/:id ───────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id:       req.params.id,
      recipient: req.user._id,
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

// ─── POST /api/notifications/register-token ──────────────────────────────────
// Saves Expo push token after login or app launch
router.post('/register-token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'token is required' });

    const role = req.user.role; // set by authMiddleware from JWT

    if (role === 'mechanic') {
      await Mechanic.findByIdAndUpdate(req.user.id, { expoPushToken: token });
    } else if (role === 'customer') {
      await User.findByIdAndUpdate(req.user.id, { expoPushToken: token });
    }
    // administrator role has no push token — skip silently

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
