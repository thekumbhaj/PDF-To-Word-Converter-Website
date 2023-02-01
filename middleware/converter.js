#!/usr/bin/env node

const libre = require('libreoffice-convert');
const fs = require('fs');
const bodyParser = require('body-parser');
const emailValidator = require('email-validator');

//validate if file for conversion exists and validted the email if it exists
function validation(req, res, next){

    try{

        //check if file exists
        if(fs.existsSync(req.uploadedDocx['path'])){
            
            //get mail from the html input field
            const email = req.body.fileUploadMail;
  
            //very the email address
            if(emailValidator.validate(email) || email === ''){

                //if the email field is not empty
                if(email !== ''){
                    
                    req.targetEmail = email;

                }

                next();

            } else {

                res.status(403).json({'data':[], 'message':'Please enter a valid email or no email at all.', 'status':403});

            }

        }

    } catch(err){

        console.log(err);
        res.status(403).json({'data':[], 'message':'Requested file for conversion does not exist!.', 'status':403})

    }

}

//convert the given file to PDF
function convert(req, res, next){

    //read docx file
    const readFile = fs.readFileSync(req.uploadedDocx['path']);
       
    //convert docx to PDF
    libre.convert(readFile, '.pdf', undefined, (err, done) =>{

        if(err){

            console.log(err);
            res.status(403).json({'data':[], 'message':'Error converting the file.', 'status':403})
           
        }
            
        //path of the pdf file
        const uploadPath = __dirname + `/../uploads/${req.uploadedDocx['nameNoExt']}.pdf`;
        
        req.pdfPath = uploadPath;
        req.pdfName = req.uploadedDocx['nameNoExt'] + '.pdf';
         
        fs.writeFileSync(uploadPath,done);

        //if mail was not passed to the input field send download
        if(!req.targetEmail){

            res.download(uploadPath);

        } 

        next();

    });

}

//increment the total number of converted files
function incrementTotalConvertedFiles(req, res){

    //location of the text file
    const convertedFilesPath = __dirname + '/../convertedFiles.txt';

    //get current total number
    let getTotalFilesConverted = fs.readFileSync(convertedFilesPath).toString();

    let total = parseInt(getTotalFilesConverted) + 1;

    //update the text file
    fs.writeFileSync(convertedFilesPath,total);

    //if email was passed reload the index page
    if(req.targetEmail){

        res.redirect('/');
        
    }

} 

module.exports = {

    validation,
    convert,
    incrementTotalConvertedFiles

}