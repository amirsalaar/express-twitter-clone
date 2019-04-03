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
        return date = years + ' Year(s) ago';
    } else if (months >= 1) {
        return date = months + ' Month(s) ago';
    } else if (days >= 1) {
        return date = days + ' Day(s) ago';
    } else if (hours >= 1) {
        return date = hours + ' Hour(s) ago';
    } else if (minutes >= 1) {
        return date = minutes + ' Minute(s) ago';
    } else {
        return 'Just now'
    }
}

function hashtagRetriever(string) {
    const tagArray = [];
    const tags = [];
    string.split(' ').forEach((element) => {
        if (element.includes('#')) {
            tagArray.push(element);
        }
    })
    tagArray.join('').split('#').forEach(tag => {
        if (tag !== '') {
            tags.push(tag.trim());
        }
    })
    return tags;
}

// cluck#index
router.get('/', (req, res) => {
    if (req.cookies.username) {
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
            .then((data) => {
                res.redirect('/');
            })

        let tags = hashtagRetriever(cluckContent);
        tags.forEach(tag => {
            knex('hashtags')
                .where('tag_name', tag)
                .then((data) => {
                    if (data.length) {
                        knex('hashtags')
                            .where('id', '=', data[0].id)
                            .update({
                                count: data[0].count + 1
                            })
                            .returning('*')
                            .then((data) => {
                                // console.log(data)
                            })
                    } else {
                        knex('hashtags')
                            .insert({
                                tag_name: tag,
                                count: 1
                            })
                            .returning('*')
                            .then((data) => {
                                // console.log(data)
                            })
                    }
                })
        })
    }
})

module.exports = router;
