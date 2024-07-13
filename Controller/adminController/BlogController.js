const userModel = require('../../Model/UserModel');
const blogModel = require('../../Model/BlogModel')




const allBlog = async (req, res) => {
    var title = "Blog"
    const cookieData = req.cookies?.USER_AUTH_TOKEN
    // return res.send(blogData)
    const userIdData = await userModel.findOne({ _token: cookieData })
    const blogData = await blogModel.find({blog_user_id:userIdData._id})
    res.render('./blog/allblog', { 'title': title, "blogData": blogData })
}

const addblog = async (req, res) => {
    var title = "blog"
    const { _id } = req.params;
    var blogIdData = ""
    if (typeof _id !== "undefined" && _id !== "") {
        blogIdData = await blogModel.findOne({ _id: _id })
    }
    res.render('./blog/addblog', { "title": title, "blogIdData": blogIdData })
}

const addblogprocess = async (req, res) => {
    const { _id, blog_name, blog_desc } = req.body
    // return res.send(req.body)
    if (!blog_name || !blog_desc) {
        return res.redirect(req.get('referer'));
    }
    // return res.send(blogObj)
    const userauthtoken = req.cookies?.USER_AUTH_TOKEN
    const userId = await userModel.findOne({ _token: userauthtoken })
    if (_id && _id != "") {
        // return res.send('yes')
        var blogObj = await blogModel.findOneAndUpdate({ _id: _id }, { blog_name, blog_desc }, { new: true })

    } else {
        // return res.send('no')
        var blogObj = await blogModel.create({ blog_name, blog_desc, blog_user_id: userId._id })
        userId.blog_id.push(blogObj._id)
        userId.save();
    }




    if (blogObj) {
        return res.redirect("/admin/blog")
    } else {
        return res.send('error')
    }
}

const deleteblog = async (req, res) => {
    try {
        const { _id } = req.params
        // res.send(_id)
        const userauthtoken = req.cookies?.USER_AUTH_TOKEN
        const userId = await userModel.findOne({ _token: userauthtoken })
        const userblogId=userId.blog_id
      
        userId.blog_id.splice(userId.blog_id.indexOf(_id),1)
        userId.save()

        const blogData = await blogModel.deleteOne({ _id: _id })
        if (blogData) {
            return res.redirect("/admin/blog")
        } else {
            return res.redirect('/admin/blog')
        }

    } catch (error) {
        res.send(error)
    }


}

module.exports = { allBlog, addblog, addblogprocess, deleteblog }
