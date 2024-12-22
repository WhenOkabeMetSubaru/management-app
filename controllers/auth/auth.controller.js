const User = require('../../models/user.model')
const jsonwt = require('jsonwebtoken');
const {expressjwt:jwt} = require('express-jwt');
const config = require('../../config/config')

const signin = async (root,args,context)=>{
    try{
        
        let user = await User.findOne({"email":args.email})
        
        if(!user){
            return {
                error:true,
                message:'User not found'
            }
        }
      
        
        if(!user.authenticate(args.password)){
            return {
                error:true,
                message:"Passwords do not match"
            }
        }
       
    
        const token = jsonwt.sign({_id:user._id,type:user.user_type},config.jwtSecret);
        // res.cookie("t",token,{expire:new Date() + 9999});

        return {
            error:false,
            message:"Login Successful",
            token,
            data:{
                _id:user._id,
                name:user.name,
                email:user.email,
                
            }
        }
    }catch(err){
        return {
            error:true,
            message:"Could not Log in"
        }
    }
}

const signout = (req,res)=>{
    res.clearCookie("t");
    return {
        error:false,
        message:"Signed out"
    }
}

const requireSignin = jwt({
    secret:config.jwtSecret,
    userProperty:'auth',
    algorithms:['RS256','sha1','HS256']
})

const hasAuthorization =(req,res,next)=>{

    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if(!(authorized)){
        return {
            error:true,
            message:'User not authorized'
        }
         
    }
            next()  
}

module.exports={signin,signout,requireSignin,hasAuthorization}