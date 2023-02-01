#!/usr/bin/env node
const crypto = require('crypto');

function extensionCheck(string, ext){

    if (string.endsWith(`.${ext}`)){ 

        return true;

    } else {

        return false;

    }

}

function validation(req, res, next){
    
    //check if file is selected
    if(req.files){
       
        const file = req.files.fileUpload;

        //generate random hex name for the file
        const fileName = crypto.randomBytes(30).toString('hex');

        //check files extension
        if(extensionCheck(file.name,'docx')){

            //uploaded docx data
            req.uploadedDocx = {

                file : file,
                name : fileName + '.docx',
                nameNoExt : fileName,
                path : __dirname + '/../uploads/' + fileName + '.docx'

            }

            next();

        } else {

            res.status(403).json({'data':[], 'message':'Incorrect extension.', 'status':403})
         
        }

    } else {

        res.status(403).json({'data':[], 'message':'No file selected.', 'status':403})

    }

}

//uplad file if it exists
function upload(req, res, next){

    //Upload the file
    req.uploadedDocx['file'].mv(req.uploadedDocx['path'], (err) => {

        if(err){

            console.log(err);
            res.status(403).json({'data':[], 'message':'Error uplading the file.', 'status':403})
            
        } 

        req.uploadPath = req.uploadedDocx['path']; 

        next();

    });

}

module.exports = {

    validation,
    upload
  
}