const express = require('express');
const router = express.Router();
const knex = require('../db/client');

router.get('/new', (req, res) => {
    if (req.cookies.username) {
        res.render('clucks/new');
    }
    res.redirect('/sign-in');
});

router.post('/new', (req, res) => {
    const username = req.cookies.username;
    const {
        cluckContent,
        imageURL
    } = req.body;
    knex
        .insert({
            username: username,
            image_url: imageURL,
            content: cluckContent,
        })
        .into('clucks')
        // .returning('*')
        .then((data) => {
            // console.log(data[0])
            res.redirect('/');
        })
})

module.exports = router;
