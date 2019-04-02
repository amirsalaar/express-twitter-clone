const express = require('express');
const router = express.Router();
const knex = require('../db/client');

function convertDate(dateInMilliseconds) {
    const ONE_MINUTE = 1000 * 60;
    const minutes = Math.floor(dateInMilliseconds / ONE_MINUTE);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);
    let date = '';
    if (years >= 1) {
        return date = years + ' Years ago';
    } else if (months >= 1) {
        return date = months + ' Months ago';
    } else if (days >= 1) {
        return date = days + ' Days ago';
    } else if (hours >= 1) {
        return date = hours + ' Hours ago';
    } else if (minutes >= 1) {
        return date = minutes + ' Minutes ago';
    } else {
        return 'Just now'
    }
}

// cluck#index
router.get('/', (req, res) => {
    if (req.cookies.username) {
        const readableDate = [];
        knex
            .select('*')
            .from('clucks')
            .where('username', req.cookies.username)
            .orderBy('created_at', 'DESC')
            .then((clucks) => {
                clucks.forEach(cluck => {
                    let dateInMilli = new Date() - new Date(cluck.created_at).getTime();
                    Object.assign(cluck, {
                        readableDate: convertDate(dateInMilli)
                    })
                });
                console.log(clucks)
                res.render('clucks/index', {
                    clucks: clucks,
                })
            })
    } else {
        res.redirect('/sign-in')
    }
})

// cluck#new GET
router.get('/new', (req, res) => {
    if (req.cookies.username) {
        res.render('clucks/new');
    }
    // res.redirect('/sign-in');
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
