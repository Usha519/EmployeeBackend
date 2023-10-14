const mongoose=require("mongoose");

const employeeSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User", 
    },
    name:{
    type:String,
    required:[true,"please add the employee name"],
    },
    email:{
        type:String,
        required:[true,"please add the employee email address"],
    },
    doj:{
        type:String,
        required:[true,"please add the date of join"],
    },
    phone:{
       type:String,
       required:[true,"please add the employee phone number"],
    },
 },
    {
        timestamps:true,
    }

);

module.exports=mongoose.model("employee",employeeSchema)