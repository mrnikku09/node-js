



route.get('/cookie', (req, res) => {
    console.clear();
    res.cookie('namee', 'niteshe');
    res.send('done')
})



route.get('/encrypt-password', (req, res) => {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("password", salt, function (err, hash) {
            res.cookie("hash", hash)
            res.send(hash)
        });
    });
})

route.get('/dcrypt-password', (req, res) => {
    bcrypt.compare("password", req.cookies.hash, function (err, result) {
        res.send(result)
    });

})





route.get('/jwt-token-set', (req, res) => {
    const token = jwt.sign({ "email": "nitesh1@gmail.com" }, 'password')
    res.cookie('_token', token)
    res.send(token)
})

route.get('/jwt-token-unset', (req, res) => {
    const verifytoken = jwt.verify(req.cookies._token, 'password')
    res.send(verifytoken)
})