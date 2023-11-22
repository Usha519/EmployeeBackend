const express=require('express');
// const path=require('path');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const cors=require('cors')
const dotenv= require('dotenv').config();
connectDb();

const app=express();


const port=process.env.PORT || 5000;  
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies, authorization headers, etc. to be sent
  }));
app.use(express.json());  
app.use(express.urlencoded({extended:true}));

// app.use(express.static(path.join(__dirname,'dist/employee-reports')));
app.use("/api/employee",require("./routes/employeeRoutes"));
app.use("/api/users",require("./routes/userRoutes")); 
app.use("/api/attendance",require("./routes/attendanceRoutes"))  ;
app.use(errorHandler);

// app.use('/*',function(req,res){
//     res.sendFile(path.join(__dirname+'/dist/employee-reports/index.html'));
// })

app.listen(port,()=>{  
    console.log(`server running in port ${port}`);      
}); 
