const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Assuming date is in string format for this example
  attendees: [
    {
      name: { type: String, required: true },
      status: { type: String, required: true, enum: ['present', 'absent', 'late'] },
      _id: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Attendance', attendanceSchema);
