const dbService = require('../services/database-service')

const getPositions = async (user) => {
    const positions = await dbService.getPositions(user)

    if (typeof positions !== 'undefined' && positions.length === 0) return { positions: null }

    return positions
}

const addPosition = async (ticker, count, averageCost, user) => {
    const positions = await dbService.addPosition(ticker, count, averageCost, user)

    return positions
}

const deletePosition = async (ticker, user) => {
    const positions = await dbService.deletePosition(ticker, user)

    return positions
}

module.exports = {
    getPositions,
    addPosition,
    deletePosition
}