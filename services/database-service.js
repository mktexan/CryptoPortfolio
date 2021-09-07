const PositionModel = require('../models/positions')

const getPositions = async () => {
    return new Promise(async (resolve, reject) => {
        PositionModel.find({}, async (err, position) => {
            if (err) return reject(err)

            return resolve(position)
        })
    })
}

const addPosition = async (ticker, count, averageCost) => {
    return new Promise(async (resolve, reject) => {
        PositionModel.find({'ticker': ticker}, async (err, position) => {
            console.log(position)
            if (err || position.length > 0) return reject(err)

            const newPosition = new PositionModel({
                ticker: ticker,
                count: count,
                averageCost: averageCost,
            })
        
            newPosition.save()

            return resolve()
        })
    })
}

module.exports = {
    getPositions,
    addPosition
}