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



 module.exports={ createAttendance,getAllAttendance, getAttendanceByDate};