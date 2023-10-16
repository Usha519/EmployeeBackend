const express=require('express');
const router=express.Router();


const {createAttendance,getAllAttendance, getAttendanceByDate, updateAttendance}= require('../controllers/attendanceController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route('/createAttendance').post(createAttendance);
router.route('/updateAttendance/:employeeId/:date').put(updateAttendance);
router.route('/getAllAttendance').get(getAllAttendance);
router.route('/getAttendance/:date').get(getAttendanceByDate);

 
module.exports=router;    