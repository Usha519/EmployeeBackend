const asyncHandler = require("express-async-handler");
const Attendance=require("../models/attendanceModel")

//@des get all employee
//@route GET /api/employee
//@access private

const getAllAttendance = asyncHandler(async (req, res) => {
  try {
    const allAttendance = await Attendance.find({}).sort({ date: -1 }); // Sort by date in descending order (-1)
    res.json({ status: "200", data: { allAttendance } });
  } catch (error) {
    res.status(500).json({ status: "500", message: "Internal Server Error", error: error.message });
  }
});

const WeekAttendance = asyncHandler(async (req, res) => {
  try {
    // Assuming the selected date is provided in the request query parameter named 'selectedDate'
    const selectedDate = req.params.selectedDate;

    // Validate that the selected date is in the correct format
    const isValidDate = !isNaN(new Date(selectedDate).getTime());
    if (!isValidDate) {
      return res.status(400).json({ status: "400", message: "Invalid date format" });
    }

    // Calculate the date 7 days ago from the selected date
    const sevenDaysAgo = new Date(selectedDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find attendance records within the specified date range
    const attendanceWithinRange = await Attendance.find({
      date: { $gte: sevenDaysAgo.toISOString(), $lte: selectedDate }
    }).sort({ date: -1 });

    res.json({ status: "200", data: { attendanceWithinRange } });
  } catch (error) {
    res.status(500).json({ status: "500", message: "Internal Server Error", error: error.message });
  }
});

const AttendanceForNextWeek = asyncHandler(async (req, res) => {
  try {
    const selectedDate = req.params.selectedDate;
    // console.log("Selected Date:", selectedDate);

    const isValidDate = !isNaN(new Date(selectedDate).getTime());
    if (!isValidDate) {
      return res.status(400).json({ status: "400", message: "Invalid date format" });
    }

    // Calculate the date 7 days later
    const sevenDaysLater = new Date(selectedDate);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 6);

    // Find attendance records within the specified date range
    const attendanceWithinRange = await Attendance.find({
      date: { $gte: selectedDate, $lte: sevenDaysLater.toISOString() }
    }).sort({ date: 1 });

    res.json({ status: "200", data: { attendanceWithinRange } });
  } catch (error) {
    res.status(500).json({ status: "500", message: "Internal Server Error", error: error.message });
  }
});


// const getAttendanceBetweenDates = asyncHandler(async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const page = parseInt(req.query.page) || 1; // Get the requested page number from the query parameters
//     const limit = parseInt(req.query.limit) || 7; // Set a default limit or get it from query parameters

//     // Check if startDate and endDate are provided in the query
//     if (!startDate || !endDate) {
//       return res.status(400).json({ status: "400", message: "Start and end dates are required." });
//     }

//     // Calculate the skip value based on the page and limit
//     const skip = (page - 1) * limit;

//     // Find attendance records between the selected dates with pagination
//     const allAttendance = await Attendance.find({
//       date: {
//         $gte: startDate, // Greater than or equal to the start date
//         $lte: endDate,   // Less than or equal to the end date
//       }
//     })
//       .skip(skip)
//       .limit(limit);

//     res.json({ status: "200", data: { allAttendance } });
//   } catch (error) {
//     res.status(500).json({ status: "500", message: "Internal Server Error", error: error.message });
//   }
// });

const getAttendanceBetweenDates = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ status: "400", message: "Start and end dates are required." });
    }

    const allAttendance = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      }
    }).sort({ date: -1 }); // Sort by date in descending order (-1)

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

  res.json({status:"200", data: {attendance}});
});

const getAttendanceByName = asyncHandler(async (req, res) => {
  try {
    const name = req.params.name; // Assuming you pass the name as a parameter in the route
    const attendance = await Attendance.find({ 'attendees.name': name });

    if (!attendance || attendance.length === 0) {
      res.status(404).json({ status: 404, error: "Attendance records not found for the specified name" });
    } else {
      // Filter the attendance records to include only the relevant attendee
      const filteredAttendance = attendance.map(record => {
        const attendees = record.attendees.filter(attendee => attendee.name === name);
        return { ...record._doc, attendees };
      });

      res.status(200).json({ status: 200, data: { attendance: filteredAttendance } });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ status: 500, error: "Error fetching attendance records by name" });
  }
});

// const updateAttendance = asyncHandler(async (req, res) => {
//   try {
//     const employeeId = req.params.employeeId;
//     const date = req.params.date;
//     const newStatus = req.body.status;

//     // Find the attendance record for the specified date
//     const attendance = await Attendance.findOne({ date });

//     if (!attendance) {
//       res.status(404);
//       throw new Error('Attendance not found');
//     }

//     // Find the attendee in the attendees array by employee ID
//     const attendeeToUpdate = attendance.attendees.find((attendee) => attendee._id === employeeId);

//     if (!attendeeToUpdate) {
//       res.status(404);
//       throw new Error('Employee not found in the attendance record');
//     }

//     // Update the status of the attendee
//     attendeeToUpdate.status = newStatus;

//     // Save the updated attendance record
//     const updatedAttendance = await attendance.save();

//     res.status(200).json({ data: updatedAttendance });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


const updateAttendance = asyncHandler(async (req, res) => {
  try {
    const date = req.params.date;
    const updatedAttendees = req.body.attendees; // This should be an array of attendee objects with _id and status

    // Find the attendance record for the specified date
    const attendance = await Attendance.findOne({ date });

    if (!attendance) {
      res.status(404);
      throw new Error('Attendance not found');
    }

    // Loop through the updatedAttendees array and update the status for the corresponding attendees
    updatedAttendees.forEach((updatedAttendee) => {
      const attendeeToUpdate = attendance.attendees.find((attendee) => attendee._id === updatedAttendee._id);
      if (attendeeToUpdate) {
        attendeeToUpdate.status = updatedAttendee.status;
      }
    });

    // Save the updated attendance record
    const updatedAttendance = await attendance.save();

    res.json({status:"200",data:{updatedAttendance}})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getLastAttendance = asyncHandler(async (req, res) => {
  try {
    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const allAttendance = await Attendance.find({
      date: { $gte: sevenDaysAgo.toISOString() } // Filter records from the last 7 days
    });

    res.json({ status: "200", data: { allAttendance } });
  } catch (error) {
    res.status(500).json({ status: "500", message: "Internal Server Error", error: error.message });
  }
});


// const getLastAttendance = asyncHandler(async (req, res) => {
//   const perPage = 10; // Number of attendees per page
//   const page = parseInt(req.query.page) || 1; // Current page, defaulting to 1

//   try {
//     const lastDate = new Date(); // Get the current date
//     lastDate.setHours(0, 0, 0, 0); // Set the time to midnight
//     const result = await Attendance.aggregate([
//       // Match records with dates less than or equal to the lastDate
//       { $match: { date: { $lte: lastDate } } },
//       // Sort by date in descending order (most recent first)
//       { $sort: { "date": -1 } },
//       // Group by date and accumulate attendees in an array
//       { $group: { _id: "$date", attendees: { $push: "$attendees" } } },
//       // Skip records for pagination
//       { $skip: (page - 1) * perPage },
//       // Project only the necessary fields
//       {
//         $project: {
//           _id: 0,
//           date: "$_id",
//           attendees: { $slice: ["$attendees", 0, perPage] }
//         }
//       }
//     ]);

//     if (!result || result.length === 0) {
//       return res.status(404).json({ status: "404", message: "No attendance records found for the specified date range." });
//     }

//     res.status(200).json({ status: "200", data: result });
//   } catch (error) {
//     res.status(500).json({ status: "500", message: "Error fetching attendance records" });
//   }
// });



 module.exports={ createAttendance,getAllAttendance, getAttendanceByDate, getAttendanceByName,updateAttendance,WeekAttendance,AttendanceForNextWeek, getLastAttendance, getAttendanceBetweenDates};