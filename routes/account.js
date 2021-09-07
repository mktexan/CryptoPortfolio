const express = require('express')
const app = express()

const accountcontroller = require('../controllers/accountController')

app.get('/getPositions', (req, res) => {
    // const token = req.body.data.token
    accountcontroller.getPositions()
        .then(position => res.send(position))
        .catch(_ => res.sendStatus(404))
})

app.post('/addPosition', (req, res) => {
    // const token = req.body.data.token
    const count = req.body.count
    const ticker = req.body.ticker
    const averageCost = req.body.avgCost

    accountcontroller.addPosition(ticker, count, averageCost)
        .then(position => res.send(position))
        .catch(_ => res.sendStatus(404))
})

module.exports = app