const express = require('express')
const app = express()

app.post('/test', (req, res) => {
    const token = req.body.data.token
    // garageDoorController.openGarageDoor(token)
    //     .then(_ => res.sendStatus(200))
    //     .catch(_ => res.sendStatus(404))

    res.sendStatus(200)
})

module.exports = app