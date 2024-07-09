   
   
   
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/basiccurd')

const userData=mongoose.Schema({
    "_token":String,
    "name":String,
    "username":String,
    "email":String,
    "password":String
})

module.exports=mongoose.model('data',userData)