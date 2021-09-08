const express = require('express')
const app = express()

app.get('/authCheck', (req, res) => {
    if(req.user && req.user.email) return res.sendStatus(200)
    else return res.sendStatus(401)
})

module.exports = app