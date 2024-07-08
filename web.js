const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const userModel = require('./userModel');
const cookieParser = require('cookie-parser');



app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')






// ************************Dashboard***********************
app.get('/', (req, res) => {
    const title = "Dashboard"
    console.log(req.cookies)
    res.render('dashboard', { 'title': title })
})

// ************************User***********************
app.get('/user', async (req, res) => {
    const title = "User"
    const userData = await userModel.find()
    // return res.send(userData)
    res.render('./user/alluser.ejs', { "title": title, 'userData': userData })
})

app.get('/add-user/:_id?', async (req, res) => {
    const title = "User"
    const { _id } = req.params;
    var userData = ""
    if (_id && _id != '') {
        userData = await userModel.findOne({ _id: _id })
    }
    // return res.send(userData)
    res.render('./user/adduser.ejs', { "title": title, "userData": userData })
})


app.post('/add-user-process', async (req, res) => {
    // res.send(req.body)
    const { _id,name, username, email } = req.body
    if (!name || !username || !email) {
        return res.redirect(req.get('referer'));
    }
    var reqestData = req.body
    if (_id && _id != "") {
        // return res.send(req.body)
        await userModel.updateOne({ _id: _id },
            { name, username, email }
        )

    } else {
        // return res.send(req.body)
        const userObj = await userModel.create({ name, username, email})
    }
    // res.render('./user/alluser.ejs')
    res.redirect('/user')

})


app.get('/delete-user/:_id', async (req, res) => {
    const { _id } = req.params

    await userModel.deleteOne({ _id: _id })
    res.redirect('/user')


})






// app.get('/creat', async (req, res) => {
//     let userdata = await userModel.create({
//         "name": 'nitesh',
//         "username": 'niteshyadava',
//         "email": 'niteshsultaniya63@gmail.com'
//     })
//     return res.json([userdata])
// })

// app.get('/read', async (req, res) => {
//     let userdata = await userModel.find()
//     return res.json(userdata)

// })

// app.get('/update', async (req, res) => {
//     let userdata = await userModel.updateMany({ username: 'niteshyadava' }, { name: '1' }, { new: true })
//     if (userdata.modifiedCount > 0) {
//         return res.send("data fetch and updated successfully")
//     } else {
//         return res.send("no data fatched")
//     }
// })

// app.get('/delete', async (req, res) => {
//     const userdata = await userModel.deleteMany({ username: 'niteshyadava' })
//     console.log(userdata)
//     if (userdata.deletedCount > 0) {
//         return res.send("data fetch and delete successfully")
//     } else {
//         return res.send("no data fatched")
//     }
// })



// app.get('/media', (req, res) => {
//     res.render('media');
// })









// todo
// app.get('/todo/:filename?', (req, res) => {
//     const { filename } = req.params
//     if (filename) {
//         console.log(filename)
//         fs.readFile(`./files/${filename}`, 'utf-8', (err, data) => {
//             if (err) {
//                 console.error('Error reading file:', err);
//                 return res.status(500).send('Error reading file');
//             }
//             // console.log(data)
//             // return res.send(data)
//             return fs.readdir('files', (err, files) => {
//                 res.render('todo', {
//                     file: files,
//                     fileIdData: { data: data, filename: filename }
//                 })
//             })

//         })
//     } else {
//         fs.readdir('files', (err, files) => {
//             res.render('todo', { file: files, fileIdData: "" })
//         })
//     }
// })


// app.post('/add-todo-process', (req, res) => {
//     if (req.body.todo_id && req.body.todo_id != '') {
//         // return res.send(req.body)
//         fs.writeFile(`./files/${req.body.todo_name}`, req.body.todo_desc, (err) => {
//             if (err) {
//                 console.error('Error writing file:', err);
//                 return res.status(500).send('Error writing file');
//             }
//             return res.redirect('/todo')
//         });
//     } else {

//         fs.writeFile(`./files/${req.body.todo_name.split(' ').join('')}.txt`, `${req.body.todo_desc}`, () => {
//             res.redirect('/todo')
//         })
//     }
// })


app.get('/cookie',(req,res)=>{
    res.cookie('namee','niteshe');
    // res.cookie('name','nitesh');
    res.send('done')
})


const bcrypt=require('bcrypt')

app.get('/encrypt-password',(req,res)=>{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("password", salt, function(err, hash) {
            // Store hash in your password DB.
            res.cookie("hash",hash)
            res.send(hash)
        });
    });
})

app.get('/dcrypt-password',(req,res)=>{
    bcrypt.compare("password", req.cookies.hash, function(err, result) {
        // result == true
        res.send(result)
    });
})




const jwt=require('jsonwebtoken')

app.get('/jwt-token-set',(req,res)=>{
    const token=jwt.sign({email:"nitesh1@gmail.com"},'password')
    res.cookie('_token',token)
    res.send(token)
})

app.get('/jwt-token-unset',(req,res)=>{
    // jwt.verify(req.)
    // res.send(req.cookies._token)
    
    const verifytoken=jwt.verify(req.cookies._token,'password')
    res.send(verifytoken)
})

app.listen(3000);