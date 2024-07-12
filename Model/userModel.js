   
   
   
const mongoose=require('mongoose')

const userData=mongoose.Schema({
    "_token":String,
    "name":String,
    "username":String,
    "email":String,
    "password":String
})

module.exports=mongoose.model('cs_users',userData)