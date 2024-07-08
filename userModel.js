   
   
   
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/basiccurd')

const userData=mongoose.Schema({
    "name":String,
    "username":String,
    "email":String
})

module.exports=mongoose.model('data',userData)