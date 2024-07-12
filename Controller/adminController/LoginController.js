const userModel = require('../../Model/UserModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const adminlogin=(req, res) => {
    const cookieData = req.cookies?.USER_AUTH_TOKEN

    if (!cookieData) {

        res.render("./login/login")
    } else {
        res.redirect('/admin/dashboard')
    }
}

const adminLoginCheck=async (req, res) => {
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
                return res.redirect('/admin/dashboard')

            } else {
                res.send('Something Went Wrong')
            }
        })
    }

}

const logout=(req, res) => {
    res.cookie("USER_AUTH_TOKEN", "")
    res.redirect('/admin/login')
}

module.exports={adminlogin,adminLoginCheck,logout}