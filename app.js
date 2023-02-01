#!/usr/bin/env node

//imports
const express = require('express');
const hbs = require('hbs');
const upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

//middleware
const fileUploadMiddleware = require('./middleware/fileUpload');
const fileConvertMiddleware = require('./middleware/converter')
const sendMailMiddleware = require('./middleware/sendMail')

const middleware = [

    fileUploadMiddleware.validation,
    fileUploadMiddleware.upload,

    fileConvertMiddleware.validation,
    fileConvertMiddleware.convert,
 
    sendMailMiddleware.sendMail,

    fileConvertMiddleware.incrementTotalConvertedFiles

]

const app = express();

app.use(upload())

require('dotenv').config();

//set view engine to handlebars
app.set('view engine', 'hbs');

//make use of public folder
app.use(express.static(path.join(__dirname, '/public')));
 


app.get('/', (req, res) => { 

    let getTotalFilesConverted = fs.readFileSync(__dirname + '/convertedFiles.txt').toString();
     
    res.render('index.hbs', {

        setDownload: 'downloadButtonDisable',
        setDownloadFlag: 'disabled',
        totalFilesConverted: getTotalFilesConverted

    })

});



//upload
app.post('/', middleware);



//listener
app.listen(PORT, (err) => {

    if(err){

        console.log(err)

    } else {
       
        console.log(`Server listening at port ${process.env.PORT} ...\n`);
        
    }

});