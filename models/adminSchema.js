

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const adminSchema =  new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        unique: true,
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    name : {
        type : String,
        trim : true
    },
    phone : {
        type : Number,
        trim : true
    },
    address : {
        type : String,
        trim : true
    },
    profile_image : {
        type : String,
    },
    tokens : [{
        token : {
            type : String,
        }
    }],
    forget_token : String,
    ftoken_expire : Number
}, {
    timestamps : true
})


adminSchema.methods.generateAuthToken  = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id} , process.env.SECRET_KEY);
    user.tokens = user.tokens.concat({token:token});
    await user.save();
    return token;

}

const AdminData = mongoose.model('admindata' , adminSchema );
module.exports = AdminData;