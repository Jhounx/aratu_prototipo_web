const express = require("express")
const mustacheExpress = require('mustache-express');
const session = require('express-session')
const bodyParser = require("body-parser")

const app = express()

let users = {}

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', `${__dirname}/views`);

const flag = process.env["FLAG"]

app.get('/admin', (req, res) => {
    if (req.session.user){
        const name = users[req.session.user]
        return res.render('admin', {is_admin: req.session.type === "admin", flag});
    }
    res.redirect("/regist")
});

app.post("/regist", (req, res)=> { 
    const body = req.body
    const username = body.username
    const name = body.name
    if (typeof users[username] != "object")  users[username] = {}
    for (let i in name){ 
        users[username][i] = name[i]
    }
    req.session.user = username
    req.session.type = "guest"
    res.redirect("/")
})

app.get("/regist", (req,res)=> res.render("regist"))

app.get('/', (req, res) => {
    if (req.session.user){
        const name = users[req.session.user]["firstname"]
        return res.render('index', {name});
    }
    res.redirect("/regist")
});

app.listen(8080, ()=> { 
    console.log("Start server!")
})