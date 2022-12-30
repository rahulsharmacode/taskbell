const AdminData = require("../models/adminSchema");
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const mailTemplate = require("./mailController");



/* admin login function */
const adminLogin = async (req,res) =>{
    try{
        let {email,password} =  req.body;

        if(!email || !password){
            return res.status(400).json({status:false , message:'failed' , data: `some fields are missing`});
        }

       

        else{

            let findEmail = await AdminData.findOne({email : email});
            if(!findEmail){
                return res.status(404).json({status:false , message:'login failed' , data: `email didn't match`});
            }
            else{

                const hashPassword = await bcrypt.compare(password , findEmail.password);

                        if(hashPassword===true ){
                            const token = await findEmail.generateAuthToken();
                            res.status(200).json({status:true , message:'login success' , token:token});
                        }    
                        
                        else{
                            return res.status(404).json({status:false , message:'login failed' , data: `password didn't match`});
                        }
            }
            
        }

        
    }
    catch(err){
        res.send(err);
    }
}

/* admin function */
const adminRegister = async (req,res) =>{
    try{
        let {email,password,cpassword,phone,address} =  req.body;

        console.log(req.body)

        if(!email || !password || !cpassword){
            return res.status(400).json({status:false , message:'failed' , data: `some fields are missing`});
        }

        if(password !== cpassword){
            return res.status(400).json({status:false , message:'failed' , data: `password & confirm password didn't matched`});
        }

        else{

            let findEmail = await AdminData.findOne({email : email});
            if(findEmail){
                return res.status(404).json({status:false , message:'failed' , data: `email already exits, try new email`});
            }
            else{

                const passwordHash = await bcrypt.hash(password , 10);
                console.log(passwordHash);
                let newAdmin = new AdminData({
                    email,password:passwordHash,phone,address
                });
                await newAdmin.save();
                res.status(200).json({status:true , message:'accoutn creation success' , data: newAdmin});
            }
            
        }

        
    }
    catch(err){
        res.send(err);
    }
}

/* admin function */
const adminForget = async (req,res) =>{
    try{
        let {email} = req.body;
       
        if(!email){
            return res.status(400).json({status:false , message:'failed' , data: `email is required`});
        }
        else{
           let findEmail = await AdminData.findOne({email:email});

           if(!findEmail){
            return res.status(400).json({status:false , message:'failed' , data: `email not found`});
           }
           else{
            const forget_token = randomstring.generate();
            const ftoken_expire = new Date().getTime()+300*1000;
            findEmail.forget_token  = forget_token;
            findEmail.ftoken_expire  = ftoken_expire;
            await findEmail.save();



            let info = await mailTemplate({type: 'forgetpassword', email : findEmail.email , forget_token , ftoken_expire});


            console.log(info , 'phase - 4 ')

            return res.status(400).json({status:true , message:'success' , data: `email found` , mail_status : info});
           }
        }
    }
    catch(err){
        res.send(err);
    }
}

/* admin function */
const adminReset = async (req,res) =>{
    try{
        const forget_token = req.headers['ftoken'];
        
        if(!forget_token){
            return res.status(400).json({status:false , message:'failed' , data: `reset token missing`});
        }
        else{
           let findAccount = await AdminData.findOne({forget_token});
           if(!findAccount){
            return res.status(400).json({status:false , message:'failed' , data: `token validation false`});
           }
           else{
                    const currentTime = new Date().getTime();

                
                    // if(   findAccount.ftoken_expire > currentTime){
                    //     console.log(true)
                    // }
                    // else{
                    //     console.log(false , '')
                    // }
                    

                    console.log(req.body.password , '=============')


                    if(findAccount.ftoken_expire > currentTime){
                    
                    const hashPassword = await bcrypt.hash(req.body.password , 10);
                    findAccount.password = hashPassword;
                    findAccount.forget_token  = null;
                    findAccount.ftoken_expire  = null;
                    await findAccount.save();
                    res.status(200).json({status:true , message:'success' , data: `password reset success`});
                    }
                    else{
                    return res.status(400).json({status:false , message:'failed' , data: `token expired, try again`});
                    }

            
           }
        }
    }
    catch(err){
        res.send(err);
    }
}

/* admin function */
const adminUpdate = async (req,res) =>{
    try{

        let {name,password,cpassword,address,phone} = req.body;

        if(password !== cpassword){
        return res.status(400).json({status:false , message:`account updation failed, password & confirm password didn't match.`});
        }
        else{


            let findAdmin = await AdminData.findById({_id:req.rootID});

            const passwordHash = await bcrypt.hash(password , 10);

            findAdmin.name = name || findAdmin.name;
            findAdmin.password = passwordHash || findAdmin.password;
            findAdmin.address = address || findAdmin.address;
            findAdmin.phone = phone || findAdmin.phone;
            await findAdmin.save();


             res.status(200).json({status:true , message:'account updation success' , data: findAdmin});
        }



    }
    catch(err){
        res.send(err);
    }
}

/* admin function */
const adminProfile = async (req,res) =>{
    try{
        
        res.status(200).json({status:true , message:'profile success' , data: req.rootUser});
    }
    catch(err){
        res.send(err);
    }
}

module.exports = {adminLogin, adminForget , adminProfile, adminRegister, adminUpdate,adminReset};