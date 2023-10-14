const express=require('express');
const router=express.Router();


const {createAttendance,getAllAttendance}= require('../controllers/attendanceController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route('/createAttendance').post(createAttendance);
//router.route('/updateAttendance').put(updateAttendance);
router.route('/getAllAttendance').get(getAllAttendance);
 
module.exports=router;    