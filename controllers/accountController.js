const dbService = require('../services/database-service')

const getPositions = async () => {
    const positions = await dbService.getPositions()

    return positions
}

const addPosition = async (ticker, count, averageCost) => {
    const positions = await dbService.addPosition(ticker, count, averageCost)

    return positions
}

module.exports = {
    getPositions,
    addPosition
}