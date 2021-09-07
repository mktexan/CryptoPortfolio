const mongoose = require('mongoose')

var positionModel = mongoose.Schema({
    ticker: String,
    count: Number,
    averageCost: Number,
})

module.exports = mongoose.model('Positions', positionModel)