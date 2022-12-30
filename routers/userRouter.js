const express = require('express');
const {adminLogin, adminForget , adminProfile, adminRegister, adminUpdate, adminReset} = require('../controllers/adminController');
const homeGet = require('../controllers/homeController');
const authentication = require('../middelware/authentication');
const userRouter = new express.Router();

/* admin api router */
userRouter.post('/api/login' , adminLogin);
userRouter.post('/api/register' , adminRegister);
userRouter.put('/api/forget-password' , adminForget);
userRouter.get('/api/profile',authentication , adminProfile);
userRouter.put('/api/update-profile',authentication , adminUpdate );
userRouter.put('/api/reset-password' , adminReset );



/* homepage api router */
userRouter.get('/api/home' ,authentication , homeGet);


/* aboutus api router */



module.exports = userRouter;