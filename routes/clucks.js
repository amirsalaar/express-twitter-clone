const express = require('express');
const router = express.Router();
const knex = require('../db/client');

// cluck#index
router.get('/', (req, res) => {
    knex
        .select('*')
        .from('clucks')
        .where('username', req.cookies.username)
        .orderBy('created_at', 'DESC')
        .then((clucks) => {
            res.render('clucks/index', {
                clucks: clucks,
            })
        })
})

// cluck#new GET
router.get('/new', (req, res) => {
    if (req.cookies.username) {
        res.render('clucks/new');
    }
    res.redirect('/sign-in');
});

// cluck#new POST
router.post('/new', (req, res) => {
    const {
        cluckContent,
        imageURL
    } = req.body;
    if (req.cookies.username) {
        knex
            .insert({
                username: req.cookies.username,
                image_url: imageURL,
                content: cluckContent,
            })
            .into('clucks')
            // .returning('*')
            .then((data) => {
                // console.log(data[0])
                res.redirect('/');
            })
    }
})

module.exports = router;
