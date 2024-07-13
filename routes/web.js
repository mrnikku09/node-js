const express=require('express')
const app=express()
const router=express.Router()
const userModel = require('../Model/UserModel');


// Admin Middleware
const AdminloginMiddleware = require('../Middleware/AdminMiddleware')


// Admin Controllers
const { adminlogin, adminLoginCheck, logout } = require('../Controller/adminController/LoginController')
const { dashboard } = require('../Controller/adminController/DashboardController')
const { AllUser, addUserProcess, addUser, deleteUser } = require('../Controller/adminController/UserController')
const { allBlog ,addblog,addblogprocess,deleteblog} = require('../Controller/adminController/BlogController')




// Login
router.get('/login', adminlogin)
router.post('/logincheck', adminLoginCheck)
router.get('/logout', logout)

// Dashboard
router.get('/dashboard',AdminloginMiddleware, dashboard)

// User
router.get('/user',AdminloginMiddleware, AllUser)
router.get('/add-user/:_id?',AdminloginMiddleware, addUser)
router.post('/add-user-process',AdminloginMiddleware, addUserProcess)
router.get('/delete-user/:_id',AdminloginMiddleware, deleteUser)

// Blog
router.get('/blog',AdminloginMiddleware,allBlog)
router.get('/addblog/:_id?',AdminloginMiddleware,addblog)
router.post('/add-blog-process',AdminloginMiddleware,addblogprocess)
router.get('/deleteblog/:_id',AdminloginMiddleware,deleteblog)


module.exports=router
