const PositionModel = require('../models/positions')

const getPositions = async (user) => {
    return new Promise(async (resolve, reject) => {
        PositionModel.find({user: user}, async (err, position) => {
            if (err) return reject(err)

            return resolve(position)
        })
    })
}

const addPosition = async (ticker, count, averageCost, user) => {
    return new Promise(async (resolve, reject) => {
        PositionModel.find({'ticker': ticker}, async (err, position) => {
            if (err || position.length > 0) return reject(err)

            const newPosition = new PositionModel({
                ticker: ticker,
                count: count,
                averageCost: averageCost,
                user: user
            })
        
            newPosition.save()

            return resolve()
        })
    })
}

const deletePosition = async (ticker, user) => {
    return new Promise(async (resolve, reject) => {
        PositionModel.deleteOne({ticker: ticker, user: user}, async (err, position) => {
            if (err) return reject(err)

            console.log('ticker and user ' + ticker)
            console.log(user)

            return resolve(position)
        })
    })
}

module.exports = {
    getPositions,
    addPosition,
    deletePosition
}