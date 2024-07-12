const dashboard=(req, res) => {
    const cookieData = req.cookies?.USER_AUTH_TOKEN

    if (!cookieData) {
        return res.redirect('/admin/login')
    } else {
        const title = "Dashboard"
        res.render('./dashboard/dashboard', { 'title': title })
    }

}

module.exports={dashboard}