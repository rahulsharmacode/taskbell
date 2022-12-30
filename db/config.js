    
    
    
    const mongoose = require('mongoose');
    mongoose.set("strictQuery", false);
    

    mongoose.connect(process.env.DATABASE).then(()=>{
        console.log(`database connected`);
    }).catch((err)=>{
        console.log(`database not connected , error  : ${err}`);
    })