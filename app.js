const port = require('dotenv').config()
const express = require('express');
const app = express();

const MONGOOESEDETAILS = process.env.MONGOOES
const mongoose = require('mongoose')
mongoose.connect(MONGOOESEDETAILS)

const cookieParser = require('cookie-parser');


const path = require('path');
const bodyParser = require('body-parser');


app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')


// **************************Admin Router*********************

const userRouter=require('./routes/web')
app.use('/admin',userRouter)

// **************************Admin Router End*********************


const PORT = process.env.PORT || 3000
app.listen(PORT);