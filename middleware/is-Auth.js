const { errorMonitor } = require("events");

const jwt=module.require('jsonwebtoken');

module.exports=(req,res,next)=>
{
    const authheader=req.get('Authorization');
    if(!authheader)
    {
        const error=new Error("Not authenticated");
        error.statusCode=401;
        throw error;
    }
    const token=authheader.split(' ')[1];
    //console.log(req.get('Cookie'));
    //token=req.get('Cookie').split('=')[1];
    let decodedtoken;
    try
    {
        decodedtoken=jwt.verify(token,'secretkey');
    }
    catch(err)
    {
           err.statusCode=500;
           return next(err);
    }  
    try
    {
        if(!decodedtoken)
        {
            const error=new error("Not authenticated");
            error.statusCode=401;
            throw error;
        }

        req.userId=decodedtoken.userId;
       // console.log(req.userId);
        next();

    }catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode=500;
        }
        next(err);
    }

}