const mongoose=require('mongoose')

const userData=mongoose.Schema({
    "_token":String,
    "name":String,
    "username":String,
    "email":String,
    "password":String,
    "blog_id":[{type:mongoose.Schema.Types.ObjectId,default:null}],
    "created_at":{
        type:Date,
        default:Date.now
    },
    "updated_at":{
        type:Date,
        default:Date.now,
        set:()=>Date.now()
    }

})

module.exports=mongoose.model('cs_users',userData)