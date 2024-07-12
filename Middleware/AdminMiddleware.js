const userModel=require('../Model/UserModel')

const AdminloginMiddleware=async (req, res, next) => {
    const userToken = req.cookies?.USER_AUTH_TOKEN;
    const user = await userModel.findOne({ _token: userToken });
    console.log(user)
    if (!user) {
        userSettingData = ""
        res.redirect('/admin/login')
    } else {
        userSettingData = user
    }

    next();
}


module.exports = AdminloginMiddleware