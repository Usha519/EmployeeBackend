const asyncHandler = require("express-async-handler");
const Employee=require("../models/employeeModel")
//@des get all employee
//@route GET /api/employee
//@access private

const getAllEmployee=asyncHandler(async(req,res)=>{
    const employees= await Employee.find({user_id:req.user.id});
    res.json({status:"200",data:{employees}});
    
});
 
 //@des create new employee 
//@route POST /api/employee
//@access private

const createEmployee=asyncHandler(async(req,res)=>{
    console.log("the req body is : ",req.body);
    const {name,email,phone}=req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error('All fields are mandatory!')
    }
    const employee=await Employee.create({
        name,
        email,
        phone,
        user_id:req.user.id
    });
    res.json({status:"200",data:{employee}});
 });

 //@des get employee
//@route GET /api/employee/:id
//@access private

const getEmployee=asyncHandler(async(req,res)=>{
    const employee=await Employee.findById(req.params.id);
    if(!employee){
        res.status(404);
        throw new Error("employee not found");
    }
    res.json({status:"200",data:{employee}});
});

//@des update employee
//@route PUT /api/employee/:id
//@access private

const updateEmployee=asyncHandler(async(req,res)=>{
    const employee=await Employee.findById(req.params.id);
    if(!employee){
        res.status(404);
        throw new Error("employee not found");
    }
    
    if(employee.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("user dont have permission to update the user employee");
    }

    const updatedEmployee=await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    ); 
    res.json({status:"200",data:{updatedEmployee}})
 });

//@des delete employee
//@route DEL /api/employee/:id
//@access private

const deleteEmployee=asyncHandler(async(req,res)=>{
    const employee=await Employee.findById(req.params.id);
    if(!employee){
        res.status(404);
        throw new Error("employee not found");
    }
    if(employee.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("user dont have permission to delete the user employee");
    }
    await Employee.deleteOne({_id:req.params.id});
    res.json({status:"200",data:{employee}});
 });

 module.exports={getAllEmployee, createEmployee,getEmployee,updateEmployee,deleteEmployee};