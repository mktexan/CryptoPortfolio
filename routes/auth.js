const express = require('express')
const app = express()
const passport = require('passport')

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/google/callback', passport.authenticate('google'), (req, res) => {
    req.session.save(() => {
        return res.redirect('/')
    })
})

app.get('/signout', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/')

    req.session.destroy((err) => {
        return res.redirect('/')
    })
})

module.exports = app