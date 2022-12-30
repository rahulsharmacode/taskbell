const cors = require('cors');
/* server required */
require('dotenv').config();
require('./db/config');



/* server defined */
const express = require('express');
const app = express();
const userRouter = require('./routers/userRouter');



/* server uses */
app.use(cors());
app.use(express.json());
app.use(express.static('./public/'));
app.use(userRouter);



/* server test */
app.get('/' , (req,res)=>{
    res.send('server tested');
})



/* server listen port */
app.listen(process.env.PORT, ()=>{
    console.log(`server running at PORT ${process.env.PORT}`);
})