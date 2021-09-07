require('dotenv').config()
const port = 7020
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const server = require('http').createServer(app)

global.io = require('socket.io')(server)

//Services
const dbService = require('./services/dbConnection')

//Routes
const priceApi = require('./routes/priceApi')
const account = require('./routes/account')

dbService.connectToMongoDb()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('frontend'))

app.use('/priceApi', priceApi)
app.use('/account', account)

server.listen(port)

console.log('Server Active: ' + port)

module.exports = app