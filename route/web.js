const express = require('express')
const route = express.Router();
const app = express();



const userModel = require('../Model/userModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');






// ************************Login***********************
route.get('/login', (req, res) => {
    const cookieData = req.cookies?.USER_AUTH_TOKEN

    // return res.send(cookieData)
    if (!cookieData) {

        res.render("./login/login")
    } else {
        res.redirect('/web/dashboard')
    }
})

route.post('/logincheck', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.redirect(req.get('referer'))
    }

    const userData = await userModel.findOne({ 'email': email })
    if (!userData) {
        return res.send("Something Went Wrong")
    }
    else {
        // return res.send(userData)
        bcrypt.compare(password, userData.password, (err, result) => {
            // res.send(result)
            if (result == true) {
                const jwttoken = jwt.sign({ "email": userData.email }, userData.password)
                // return res.send(jwttoken)
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


route.get('/logout', (req, res) => {


    res.cookie("USER_AUTH_TOKEN", "")
    res.redirect('/web/login')
})


// Common User Data

route.use(async (req, res, next) => {
    const userToken = req.cookies?.USER_AUTH_TOKEN;
    const user = await userModel.findOne({ _token: userToken });
    if (!user) {
        userSettingData = ""
        res.redirect('/web/login')
    } else {
        userSettingData = user
    }

    // return res.send(userSettingData)
    next();
})

// ************************Dashboard***********************
route.get('/dashboard', (req, res) => {
    const cookieData = req.cookies?.USER_AUTH_TOKEN

    // return res.send(cookieData)
    if (!cookieData) {
        return res.redirect('/login')
    } else {
        const title = "Dashboard"
        res.render('./dashboard/dashboard', { 'title': title })
    }
    // const title = "Dashboard"

    //     res.render('./dashboard/dashboard', { 'title': title })
})



// ************************User***********************
route.get('/user', async (req, res) => {
    const title = "User"
    const userData = await userModel.find()
    // return res.send(userData)
    res.render('./user/alluser.ejs', { "title": title, 'userData': userData })
})

route.get('/add-user/:_id?', async (req, res) => {
    const title = "User"
    const { _id } = req.params;
    var userData = ""
    if (_id && _id != '') {
        userData = await userModel.findOne({ _id: _id })
    }
    // return res.send(userData)
    res.render('./user/adduser.ejs', { "title": title, "userData": userData })
})


route.post('/add-user-process', (req, res) => {
    // return res.send(req.body)
    const { _id, name, username, email, password } = req.body
    if (!name || !username || !email || !password) {
        return res.redirect(req.get('referer'));
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hashpassword) => {
            // return console.log(res)
            if (hashpassword) {
                if (_id && _id != "") {
                    // return res.send(req.body)
                    await userModel.updateOne({ _id: _id },
                        { name, username, email, "password": hashpassword }
                    )
                } else {
                    const userObj = await userModel.create({ name, username, email, "password": hashpassword })
                }
                res.redirect('/web/user')
            }
        })
    })
})


route.get('/delete-user/:_id', async (req, res) => {
    const { _id } = req.params
    await userModel.deleteOne({ _id: _id })
    res.redirect('/web/user')
})







route.get('/cookie', (req, res) => {
    console.clear();
    res.cookie('namee', 'niteshe');
    // res.cookie('name','nitesh');
    res.send('done')
})



route.get('/encrypt-password', (req, res) => {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("password", salt, function (err, hash) {
            // Store hash in your password DB.
            res.cookie("hash", hash)
            res.send(hash)
        });
    });
})

route.get('/dcrypt-password', (req, res) => {
    bcrypt.compare("password", req.cookies.hash, function (err, result) {
        // result == true
        res.send(result)
    });

})





route.get('/jwt-token-set', (req, res) => {
    const token = jwt.sign({ "email": "nitesh1@gmail.com" }, 'password')
    res.cookie('_token', token)
    res.send(token)
})

route.get('/jwt-token-unset', (req, res) => {
    // jwt.verify(req.)
    // res.send(req.cookies._token)

    const verifytoken = jwt.verify(req.cookies._token, 'password')
    res.send(verifytoken)
})



module.exports = route