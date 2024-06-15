const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const flash = require('connect-flash');
const session = require('express-session');
const crypto = require('crypto');
const User = require('./models/User');
const questionRoutes = require('./routes/questionroutes');
const Score = require('./models/Score'); // Import Score model

const sessionSecret = crypto.randomBytes(32).toString('hex');

// Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

app.use(flash());

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/loginPage');
}

// MongoDB connection
const dbURL = 'mongodb+srv://trial1:b0urb0nk@trial.kevezfl.mongodb.net/your-db-name?retryWrites=true&w=majority&appName=Trial';

mongoose.connect(dbURL)
    .then(() => {
        console.log("Connected to database successfully!");
        app.listen(5500);
    })
    .catch((err) => {
        console.log(err);
    });

// Routes
app.use('/auth', authRoutes);
app.use('/forum', questionRoutes);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// Serve static files
app.use(express.static('static_files'));

// Home page
app.get('/', (req, res) => {
    res.render('preLoginPage');
});

// Main page (authenticated)
app.get('/main', isAuthenticated, (req, res) => {
    res.render('homePage', { title: 'main' });
});

// Login page
app.get('/loginPage', (req, res) => {
    res.render('loginPage.ejs');
});

// Signup page
app.get('/signup', (req, res) => {
    res.render('signupPage.ejs');
});

// Videos page
app.get('/videos', (req, res) => {
    res.render('animationVideos.ejs');
});

// Games page
app.get('/games', (req, res) => {
    res.render('Games.ejs');
});

// Forum page
app.get('/forum', (req, res) => {
    res.render('forum.ejs');
});

// Forum post question page
app.get('/forum-postQuestion', (req, res) => {
    res.render('postQuestion.ejs');
});

// Account settings page (authenticated)
app.get('/accountSettings', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render('accountSettings.ejs', { user });
});


// POST route to handle saving scores
app.post('/post-score', (req, res) => {
    const { playerName, score } = req.body;

    // Create a new Score document
    const newScore = new Score({
        playerName,
        score
    });

    // Save the score to MongoDB
    newScore.save()
        .then(() => {
            console.log('Score saved successfully');
            res.status(200).send('Score saved');
        })
        .catch(err => {
            console.error('Error saving score:', err);
            res.status(500).send('Error saving score');
        });
});

// 404 page
app.use((req, res) => {
    res.render('404');
});

module.exports = app;
