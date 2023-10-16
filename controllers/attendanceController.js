const asyncHandler = require("express-async-handler");
const Attendance=require("../models/attendanceModel")

//@des get all employee
//@route GET /api/employee
//@access private

const getAllAttendance = asyncHandler(async (req, res) => {
  try {
    const allAttendance = await Attendance.find({});
    res.json({ status: "200", data: { allAttendance } });
  } catch (error) {
    res.status(500).json({ status: "500", message: "Internal Server Error", error: error.message });
  }
});

 //@des create attendance for new day
//@route POST /api/employee
//@access private

const createAttendance = asyncHandler(async (req, res) => {
    console.log("the req body is : ", req.body);
    const { date, attendees } = req.body;
  
    if (!date || !attendees || !attendees.length) {
      res.status(400);
      throw new Error('Date and attendees are mandatory!');
    }
  
    const attendance = await Attendance.create({
      date,
      attendees
    });
  
    res.json({ status: "200", data: { attendance } });
  });

//  @des get employee
// @route GET /api/employee/:id
// @access private

const getAttendanceByDate = asyncHandler(async (req, res) => {
  const date = req.params.date; // Assuming you pass the date as a parameter in the route
  // console.log("Date:", date);
  const attendance = await Attendance.find({ date }); // Find attendance records for the specified date

  if (!attendance || attendance.length === 0) {
    res.status(404);
    throw new Error("Attendance records not found for the specified date");
  }

  res.status(200).json({ data: attendance });
});

// Your Attendance model definition remains the same

const updateAttendance = asyncHandler(async (req, res) => {
  try {
    const attendanceId = req.params.id;
    const newStatus = req.body.status; // Assuming you pass the new status in the request body

    // Find the attendance record by ID
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      res.status(404);
      throw new Error('Attendance not found');
    }

    // Check if the provided date matches the date in the attendance record
    if (attendance.date !== req.body.date) {
      res.status(403);
      throw new Error('User does not have permission to update this attendance');
    }

    // Find the attendee in the attendees array by ID
    const attendeeToUpdate = attendance.attendees.find((attendee) => attendee._id === req.body.attendeeId);

    if (!attendeeToUpdate) {
      res.status(404);
      throw new Error('Attendee not found in the attendance record');
    }

    // Update the status of the attendee
    attendeeToUpdate.status = newStatus;

    // Save the updated attendance record
    const updatedAttendance = await attendance.save();

    res.status(200).json({ data: updatedAttendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



 module.exports={ createAttendance,getAllAttendance, getAttendanceByDate, updateAttendance};