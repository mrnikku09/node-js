const port=require('dotenv').config()
const express = require('express');
const app = express();

const MONGOOESEDETAILS=process.env.MONGOOES
const mongoose = require('mongoose')
mongoose.connect(MONGOOESEDETAILS)

const cookieParser = require('cookie-parser');


const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');


app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')



const userModel = require('./Model/userModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');







// ============================================= Web Route =================================================

// ************************Login***********************
app.get('/web/login', (req, res) => {
    const cookieData = req.cookies?.USER_AUTH_TOKEN

    if (!cookieData) {

        res.render("./login/login")
    } else {
        res.redirect('/web/dashboard')
    }
})

app.post('/web/logincheck', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.redirect(req.get('referer'))
    }

    const userData = await userModel.findOne({ 'email': email })
    if (!userData) {
        return res.send("Something Went Wrong")
    }
    else {
        bcrypt.compare(password, userData.password, (err, result) => {
            if (result == true) {
                const jwttoken = jwt.sign({ "email": userData.email }, userData.password)
                userData._token = jwttoken
                userData.save()
                res.cookie("USER_AUTH_TOKEN", jwttoken)
                return res.redirect('/web/dashboard')

            } else {
                res.send('Something Went Wrong')
            }
        })
    }

})


app.get('/web/logout', (req, res) => {
    res.cookie("USER_AUTH_TOKEN", "")
    res.redirect('/web/login')
})


// ************************Common User Data***********************

app.use(async (req, res, next) => {
    const userToken = req.cookies?.USER_AUTH_TOKEN;
    const user = await userModel.findOne({ _token: userToken });
    if (!user) {
        userSettingData = ""
        res.redirect('/web/login')
    } else {
        userSettingData = user
    }

    next();
})

// ************************Dashboard***********************
app.get('/web/dashboard', (req, res) => {
    const cookieData = req.cookies?.USER_AUTH_TOKEN

    if (!cookieData) {
        return res.redirect('/login')
    } else {
        const title = "Dashboard"
        res.render('./dashboard/dashboard', { 'title': title })
    }

})



// ************************User***********************
app.get('/web/user', async (req, res) => {
    const title = "User"
    const userData = await userModel.find()
    res.render('./user/alluser.ejs', { "title": title, 'userData': userData })
})

app.get('/web/add-user/:_id?', async (req, res) => {
    const title = "User"
    const { _id } = req.params;
    var userData = ""
    if (_id && _id != '') {
        userData = await userModel.findOne({ _id: _id })
    }
    res.render('./user/adduser.ejs', { "title": title, "userData": userData })
})


app.post('/web/add-user-process', (req, res) => {
    const { _id, name, username, email, password } = req.body
    if (!name || !username || !email) {
        return res.redirect(req.get('referer'));
    }
    if (!_id && !password) {
        return res.redirect(req.get('referer'));
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hashpassword) => {
            if (hashpassword) {
                if (_id && _id != "") {

                    let userObj = await userModel.findOne({ _id: _id })

                    if (!password) {
                    } else {
                        userObj.password = hashpassword
                    }
                    userObj.name = name
                    userObj.username = username
                    userObj.email = email
                    userObj.save()
                } else {
                    const userObj = await userModel.create({ name, username, email, "password": hashpassword })
                }
                res.redirect('/web/user')
            }
        })
    })
})


app.get('/web/delete-user/:_id', async (req, res) => {
    const { _id } = req.params
    await userModel.deleteOne({ _id: _id })
    res.redirect('/web/user')
})



// ============================================= Web Route End =================================================



// const route = require('./route/web');
// app.use('/web',route)

// ============================================= Api Route =================================================

const PORT=process.env.PORT
console.log(PORT)
app.listen(PORT);