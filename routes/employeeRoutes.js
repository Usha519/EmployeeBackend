const express=require('express');
const router=express.Router();


const {getAllEmployee,createEmployee,getEmployee,updateEmployee,deleteEmployee}= require('../controllers/employeeController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);
router.route('/getAllEmployee').get(getAllEmployee);
router.route('/createEmployee').post(createEmployee);

router.route('/updateEmployee/:id').put(updateEmployee);
router.route('/deleteEmployee/:id').delete(deleteEmployee);
router.route('/getEmployee/:id').get(getEmployee);
 
module.exports=router;    