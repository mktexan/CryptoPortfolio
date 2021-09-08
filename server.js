require('dotenv').config()
const port = 7020
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const app = express()
const passport = require('passport')
const session = require('express-session')
const server = require('http').createServer(app)

const requireUser = require('./helper-functions').requireUser

require('./passport/passport')(passport)

global.io = require('socket.io')(server)

//Services
const dbService = require('./services/dbConnection')

//Routes
const priceApi = require('./routes/priceApi')
const account = require('./routes/account')
const user = require('./routes/user')
const auth = require('./routes/auth')

dbService.connectToMongoDb()

const expressSession = session({
    resave: true, saveUninitialized: true, secret: process.env.passportSecret, cookie: { maxAge: 36000000 }, key: 'connect.sid'
})


app.use(morgan('dev'))
app.use(express.static('frontend'))
app.use(cors())
app.use(express.urlencoded({ extended: true, limit: '200mb' }))
app.use(express.json({ limit: '200mb' }))
app.use(expressSession)
app.use(passport.initialize())
app.use(passport.session())

app.use('/priceApi', priceApi)
app.use('/account', account)
app.use('/user', user)
app.use('/auth', auth)

server.listen(port)

console.log('Server Active: ' + port)

module.exports = app