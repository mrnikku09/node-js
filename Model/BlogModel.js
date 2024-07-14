const mongoose = require('mongoose')

const blogData = mongoose.Schema({
    blog_name: {
        type: String,
        required: true
    },
    blog_desc: {
        type: String,
        required: true
    },
    blog_image:{type: String,default:null},
    blog_user_id: [{ type: String, required: true }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updated_at:{
        type:Date,
        default:Date.now,
        set:()=>Date.now()
    }
})

const blog = mongoose.model('cs_blogs', blogData)

module.exports = blog