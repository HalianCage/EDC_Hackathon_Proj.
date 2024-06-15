const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const flash = require('connect-flash');
const session = require('express-session');
const crypto = require('crypto');
// const questionRoutes = require('./routes/questionroutes');


const sessionSecret = crypto.randomBytes(32).toString('hex');

//express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: sessionSecret, // Use the generated session secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// app.use('/api', questionRoutes);


// connection to mongoDB
const dbURL = 'mongodb+srv://trial1:b0urb0nk@trial.kevezfl.mongodb.net/?retryWrites=true&w=majority&appName=Trial';

mongoose.connect(dbURL)
    //runs on connection to database
    .then((result) => {
        console.log("Connected to database successfully!");
        //listen for server requests
        app.listen(5500);
    })
    .catch((err) => {
        console.log(err);
    })

app.use(flash());
app.use('/auth', authRoutes);

//register view engine
app.set('view engine', 'ejs');
app.set('views', 'views'); //important in case the folder name having the ejs files has different name

//middleware & static files
app.use(express.static('static_files'));

app.get('/', (req, res) => {
        res.render('preLoginPage');
    });

app.get('/main', (req, res) => {
    res.render('homePage', {title : 'main'});
});

app.get('/loginPage', (req, res) => {
    res.render('loginPage.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signupPage.ejs');
});

app.get('/videos', (req, res) => {
    res.render('animationVideos.ejs');
});

app.get('/games', (req, res) => {
    res.render('Games.ejs');
});

app.get('/forum', (req, res) => {
    res.render('forum.ejs');
});
//redirect using express
// app.get('/about', (req, res) => {
//     res.redirect('/');
// })

//404 page
app.use((req, res) => {
    res.render('404');
})