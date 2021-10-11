const PositionModel = require('../models/positions')

const getPositions = async (user) => {
    return new Promise(async (resolve, reject) => {
        PositionModel.find({ user: user }, async (err, position) => {
            if (err) return reject(err)

            return resolve(position)
        })
    })
}

const addPosition = async (ticker, count, averageCost, user) => {
    return new Promise(async (resolve, reject) => {
        PositionModel.find({ 'ticker': ticker.toLowerCase() }, async (err, position) => {
            if (err || position.length > 0) return reject(err)

            const newPosition = new PositionModel({
                ticker: ticker.toLowerCase(),
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
        PositionModel.deleteOne({ ticker: ticker, user: user }, async (err, position) => {
            if (err) return reject(err)

            console.log('ticker and user ' + ticker)
            console.log(user)

            return resolve(position)
        })
    })
}

const setPriceTarget = async (target, ticker, user) => {
    return new Promise(async (resolve, reject) => {
        PositionModel.findOne({ ticker: ticker, user: user }, (err, position) => {
            if (err) return reject(err)

            const targets = position.targets

            if (targets.includes(target)) return resolve(position)

            targets.push(target)

            position.targets = targets

            position.save()

            return resolve(position)
        })
    })
}

const removePriceTarget = async (target, ticker, user) => {
    return new Promise(async (resolve, reject) => {
        PositionModel.findOne({ ticker: ticker, user: user }, (err, position) => {
            if (err) return reject(err)

            const targets = position.targets.filter(x => x !== target)

            position.targets = targets

            position.save()

            return resolve(position)
        })
    })
}

module.exports = {
    getPositions,
    addPosition,
    deletePosition,
    setPriceTarget,
    removePriceTarget
}