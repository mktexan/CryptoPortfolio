const express = require('express')
const app = express()

const accountcontroller = require('../controllers/accountController')

app.get('/getPositions', (req, res) => {
    const user = req.user.email

    accountcontroller.getPositions(user)
        .then(position => res.send(position))
        .catch(_ => res.sendStatus(404))
})

app.post('/addPosition', (req, res) => {
    const count = req.body.count
    const ticker = req.body.ticker
    const averageCost = req.body.avgCost
    const user = req.user.email

    accountcontroller.addPosition(ticker, count, averageCost, user)
        .then(position => res.send(position))
        .catch(_ => res.sendStatus(404))
})

app.delete('/deletePosition', (req, res) => {
    const ticker = req.body.ticker
    const user = req.user.email

    accountcontroller.deletePosition(ticker, user)
        .then(position => res.send(position))
        .catch(_ => res.sendStatus(404))
})

app.post('/setPriceTarget', (req, res) => {
    const target = Number(req.body.target)
    const ticker = req.body.ticker
    const user = req.user.email

    accountcontroller.setPriceTarget(target, ticker, user)
        .then(_ => res.sendStatus(200))
        .catch(_ => res.sendStatus(404))
})

app.delete('/removePriceTarget', (req, res) => {
    const target = Number(req.body.target)
    const ticker = req.body.ticker
    const user = req.user.email

    accountcontroller.removePriceTarget(target, ticker, user)
        .then(_ => res.sendStatus(200))
        .catch(_ => res.sendStatus(404))
})



module.exports = app