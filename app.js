const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

app.set("view engine", "ejs");

// MORGAN
app.use(logger('dev'));

// URLENCODED
app.use(express.urlencoded({
  extended: true
}));

// COOKIER PARSER
app.use(cookieParser());

// STATIC ASSETS
app.use(express.static(path.join(__dirname, "public")));
// -- Bootstrap/css
app.use("/styles/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
// -- Bootstrap/js
app.use("/scripts/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
// -- jQuery
app.use("/scripts/js", express.static(path.join(__dirname, "node_modules/jquery/dist")));


// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
  console.log("🍪 Cookies:", req.cookies);
  res.locals.username = req.cookies.username || '';
  next();
})

// -= ROUTES =-
app.get('/', (req, res) => {
  res.render('index')
});

app.get('/sign-in', (req, res) => {
  res.render('sign-in');
});

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 1; // One Day
app.post('/sign-in', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username, {
    age: COOKIE_MAX_AGE
  })
  res.redirect('/')
});

app.post('/sign-out', (req, res) => {
  res.clearCookie('username');
  res.redirect('/sign-in');
});

//  LISTEN
const PORT = 4550;
const ADDRESS = "localhost"; // 127.0.0.1
app.listen(PORT, ADDRESS, () => {
  console.log(`Server listenning on http://${ADDRESS}:${PORT}`);
});
