const express = require('express');
// const mongoose = require('mongoose');

//connection to mongoDB
// const dbURL = 'mongodb+srv://trial1:b0ur0bnk@trial.kevezfl.mongodb.net/?retryWrites=true&w=majority&appName=Trial';

// mongoose.connect(dbURL);

//express app
const app = express();

//register view engine
app.set('view engine', 'ejs');
app.set('views', 'views'); //important in case the folder name having the ejs files has different name

//listen for requests
app.listen(5500);

//middleware & static files
app.use(express.static('static_files'));

app.get('/', (req, res) => {
        res.render('preLoginPage');
    });

app.get('/main', (req, res) => {
    res.render('afterLoginPage', {title : 'main'});
});

app.get('/loginPage', (req, res) => {
    res.render('loginPage1.ejs');
});

app.get('/videos', (req, res) => {
    res.render('animationVideos.ejs');
});

app.get('/games', (req, res) => {
    res.render('Games.ejs');
});

app.get('/forum', (req, res) => {
    res.render('doubtForum.ejs');
});
//redirect using express
// app.get('/about', (req, res) => {
//     res.redirect('/');
// })

//404 page
app.use((req, res) => {
    res.render('404');
})