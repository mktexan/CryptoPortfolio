const mongoose = require('mongoose')

const connectToMongoDb = () => {
    mongoose.connect(process.env.mongoConnectionStringMlab, { useNewUrlParser: true, useUnifiedTopology: true })

    let db = mongoose.connection

    db.once('open', () => console.log('connected to the database'))

    db.on('error', console.error.bind(console, 'MongoDB connection error:'))
}

module.exports = { connectToMongoDb }