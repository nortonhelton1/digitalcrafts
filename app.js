
const express = require('express')
const app = express()
var session = require('express-session')
const mustacheExpress = require("mustache-express")
const bodyParser = require("body-parser")
const PORT = 3000
// importing bcryptjs 
var bcrypt = require('bcryptjs');

// initializing pg promise
const pgp = require('pg-promise')()
console.log(pgp)

const connectionString = "postgres://pcyjimek:lhqVQlqXONMD8qlNehPpsUH7pEl9uGxI@chunee.db.elephantsql.com/pcyjimek"

const db = pgp(connectionString)

//setup the engine for mustache
app.engine('mustache', mustacheExpress())
//setup | where express is going to find the views, which is the views folder
app.set("views", "./views")
//setup | the extension pages will be mustache
app.set("view engine", "mustache")
//setup use for body parser, this is imporant for passing data from html to server
app.use(bodyParser.urlencoded({ extended: false }))

// initialize a session 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//Adding section to the list
app.get("/", (req, res) => {
    db.any('SELECT veggie_id, veggies FROM hydroponics;')
        .then(veggies => {
            res.render('index', { veggies: veggies })
        })
})

app.post('/', (req, res) => {
    const veggies = req.body.veggies
    //INSERT INTO hydroponics(veggies) VALUES('carrot');
    db.none('INSERT INTO hydroponics(veggies) VALUES($1)', [veggies])
        .then(() => {
            res.redirect('/')
        })
})

//Get the delete page
app.get('/delete', (req, res) => {
    db.any('SELECT veggie_id, veggies FROM hydroponics;')
        .then(veggies => {
            res.render('delete', { veggies: veggies })
        })
})

app.post('/delete', (req, res) => {
    const veggie_id = parseInt(req.body.veggie_id)
    db.none('DELETE FROM hydroponics WHERE veggie_id = $1', [veggie_id])
        .then(() => {
            res.redirect('delete')
        })
})

//Registration Part

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    bcrypt.genSalt(10, function (error, hash) {
        if (!error) {
            //insert into the database
            db.none('INSERT INTO users(username, password) Values($1, $2)', [username, hash])
                .then(() => {
                    res.redirect('login')
                })
        }
    })

})
// Login pages
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    db.one('SELECT user_id, username, password FROM users WHERE username = $1', [username])
        .then((user) => {
            bcrypt.compare(password, user.password, function (error, result) {
                if (result) {
                    if (req.session) {
                        req.session.userId = user.user_id
                    }
                    res.redirect('index')
                } else {
                    res.send('NOT AUTHENTICATED')
                }
            })
        })
})

//

app.listen(PORT, () => {
    console.log("Server is running")
})
