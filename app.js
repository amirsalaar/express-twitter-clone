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
// console.log("__dirname:", __dirname);
app.use(express.static(path.join(__dirname, "public")));

// -= ROUTES =-



//  LISTEN
const PORT = 4550;
const ADDRESS = "localhost"; // 127.0.0.1
app.listen(PORT, ADDRESS, () => {
  console.log(`Server listenning on http://${ADDRESS}:${PORT}`);
});
