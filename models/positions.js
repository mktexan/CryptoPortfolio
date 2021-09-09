const mongoose = require('mongoose')

const positionModel = mongoose.Schema({
    ticker: String,
    count: Number,
    averageCost: Number,
    user: String
})

module.exports = mongoose.model('Positions', positionModel)