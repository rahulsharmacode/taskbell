


const homeGet = async (req,res) =>{
    try{
        res.status(200).json({status:true , message:'success' , data: `controller tested`});
    }
    catch(err){
        res.send(err);
    }
}

module.exports = homeGet;