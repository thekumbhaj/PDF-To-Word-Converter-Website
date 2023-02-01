#!/usr/bin/env node

const nodeMailer = require('nodemailer');

//send the mail
function sendMail(req, res, next){
    
    if(req.targetEmail){

        //sender
        const transporter = nodeMailer.createTransport({

            service: 'gmail',
            host: 'smtp.gmail.com' ,
            secure: true,

            auth:{

                user: process.env.EMAIL, //env var
                pass: process.env.PASSWORD //env var

            },

            tls: {

                rejectUnauthorized: false

            }

        });

        const mailSettings = {

            from: process.env.EMAIL, //env var
            to: req.targetEmail,

            subject: 'wordToPDF',
            text: 'Thank you for using our service. Here is you PDF file!',
            attachments:[{

                filename: req.pdfName,
                path: req.pdfPath,
                contentType: 'application/pdf'

            }]
            
        }

        transporter.sendMail(mailSettings, (err) =>{

            if(err){

                console.log(err);
                res.status(403).json({'data':[], 'message':'Failed sending the attachement to the targed email.', 'status':403});

            }

        });

    }
            
    next();
}

module.exports = {

    sendMail

}