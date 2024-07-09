const express = require('express');
const app = express();

const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/basiccurd')

const cookieParser = require('cookie-parser');


const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');


app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')




const route = require('./route/web');
app.use('/web',route)



app.listen(3000);