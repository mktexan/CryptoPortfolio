const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    token: String,
    google_id: String,
    creation_date: Date
})

module.exports = mongoose.model('users', userSchema)