const userModel=require('../Model/UserModel')
const env=require('dotenv').config()
const express=require('express')
const path=require('path')
const AdminloginMiddleware=async (req, res, next) => {
    const userToken = req.cookies.USER_AUTH_TOKEN;
    // res.send(userToken)
    const user = await userModel.findOne({ _token: userToken });
    ENV=process.env
    if (!user) {
        userSettingData = ""
        res.redirect('/admin/login')
    } else {
        userSettingData = user
    }

    next();
}


module.exports = AdminloginMiddleware