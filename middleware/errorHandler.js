const{constants}=require("../employees");
const errorHandler = (err,req,res,next)=>{
    const statusCode=res.statusCode ? res.statusCode : 500;
    switch(statusCode){
        case employees.VALIDATION_ERROR:
            res.json({title:'validation failed',
            message:err.message,
            stackTrace:err.stack,
            });
            break;
        case employees.N0T_FOUND:
            res.json({title:'not found',
            message:err.message,
            stackTrace:err.stack
           });
        case employees.UNAUTHORIZED:
            res.json({title:'unauthorized',
            message:err.message,
            stackTrace:err.stack
           });
        case employees.FORBIDDEN:
            res.json({title:'forbidden',
            message:err.message,
            stackTrace:err.stack
           });
        case employees.SERVER_ERROR:
            res.json({title:'server error',
            message:err.message,
            stackTrace:err.stack
           });
        default:
            console.log("no error ,All good")
            break;

    }
};

module.exports=errorHandler;