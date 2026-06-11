const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'role' },
  role:      { type: String, enum: ['customer', 'mechanic', 'administrator'], required: true },
  type:      { type: String, required: true },
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  booking:   { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  read:      { type: Boolean, default: false },
  readAt:    { type: Date, default: null },
  channels: {
    push: { sent: { type: Boolean, default: false }, sentAt: Date },
    sms:  { sent: { type: Boolean, default: false }, sentAt: Date },
  },
}, { timestamps: true });

notificationSchema.methods.markRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);