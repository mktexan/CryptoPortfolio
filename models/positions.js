const mongoose = require('mongoose')

var positionModel = mongoose.Schema({
    ticker: String,
    count: Number,
    averageCost: Number,
    user: String
})

module.exports = mongoose.model('Positions', positionModel)