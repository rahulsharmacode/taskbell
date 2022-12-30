



const jwt = require('jsonwebtoken');
const AdminData = require('../models/adminSchema');


const authentication = async (req,res,next) =>{
    try{
        const token = req.headers['auth-token'];
        const verifyToken = jwt.verify(token , process.env.SECRET_KEY);
        if(verifyToken){
            const findAdmin = await AdminData.findById({_id:verifyToken._id}).select('-password -tokens -__v');
            req.rootID = verifyToken._id;
            req.rootUser = findAdmin;
            req.token = token;
        }
        else{
            return res.status(404).json({status:false , message:'token verification failed'});
        }

        next();
    }
    catch(err){
        return res.status(406).json({status:false , message:'failed' , error: err});
    }
}


module.exports = authentication;

