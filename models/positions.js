const mongoose = require('mongoose')

const positionModel = mongoose.Schema({
    ticker: String,
    count: Number,
    averageCost: Number,
    user: String,
    targets: Array
})

module.exports = mongoose.model('Positions', positionModel)