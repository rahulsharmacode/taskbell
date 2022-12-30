const nodemailer = require('nodemailer');

const mailTemplate = async (props) =>{

    console.log(props , 'innder phase - 000')
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true, 
            auth: {
              user: process.env.MAIL_ID, // generated ethereal user
              pass: process.env.MAIL_PASS, // generated ethereal password
            },
          });
        
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: ` "${process.env.MAIL_NAME}" ${process.env.MAIL_ID}`, // sender address
            to: props.email, // list of receivers
            subject: "Password Reset", // Subject line
            text: "Hi there, please follow the below link to reset your passwors", // plain text body
            html: `Reset Link : <a href='${process.env.CLIENT_BASE_URL}/reset-password/${props.forget_token}'>${process.env.CLIENT_BASE_URL}/reset-password/${props.forget_token} </a>  expires at : <span style="color:red">${props.ftoken_expire}</span>ms`, // html body
          });
        
          return info
    }
    catch(err){
        console.log(err)
    }
}


module.exports = mailTemplate;