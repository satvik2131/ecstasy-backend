const functions = require('firebase-functions');
const express = require('express');
const app1 = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');




//    *******************
//    M I D D L E W A R E
//    *******************

app1.use(cors({ origin: true }))

//express parsing json
app1.use(express.json())

//Cookie parser
app1.use(cookieParser());

//Body Parser

// parse application/x-www-form-urlencoded
app1.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app1.use(bodyParser.json());

//Routes setup
const users = require('./routes/users');



//Setting users routes
app1.use(users);

// const runtimeOpts = {
//     timeoutSeconds: 540,
//   }

exports.app1 = functions
// .runWith(runtimeOpts)
.https.onRequest(app1);



