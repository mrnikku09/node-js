const userModel = require('../../Model/UserModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const AllUser = async (req, res) => {
    const title = "User"
    const userData = await userModel.find()
    res.render('user/alluser.ejs', { "title": title, 'userData': userData })
}

const addUser = async (req, res) => {
    const title = "User"
    const { _id } = req.params;
    var userData = ""
    if (_id && _id != '') {
        userData = await userModel.findOne({ _id: _id })
    }
    res.render('./user/adduser.ejs', { "title": title, "userData": userData })
}

const addUserProcess = (req, res) => {
    const { _id, name, username, email, password } = req.body

    // var arrname=name
    // var commaimplodename = arrname.join(",");

    

    // return res.send(commaimplodename)
    
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
                res.redirect('/admin/user')
            }
        })
    })
}

const deleteUser = async (req, res) => {
    const { _id } = req.params
    await userModel.deleteOne({ _id: _id })
    res.redirect('/admin/user')
}
module.exports = { AllUser, addUserProcess, addUser, deleteUser }
