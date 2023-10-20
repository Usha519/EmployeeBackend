const express=require('express');
const router=express.Router();


const {createAttendance,getAllAttendance, getAttendanceByDate, updateAttendance, getAttendanceByName, getLastAttendance}= require('../controllers/attendanceController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route('/createAttendance').post(createAttendance);
router.route('/updateAttendance/:date').put(updateAttendance);
router.route('/getAllAttendance').get(getAllAttendance);
router.route('/getAttendance/:date').get(getAttendanceByDate);
router.route('/byName/:name').get(getAttendanceByName);
router.route('/getThreeAttendance').get(getLastAttendance);

 
module.exports=router;    