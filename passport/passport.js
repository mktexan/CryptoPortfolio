const config = require('./config.js')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const UserModel = require('../models/user')

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        UserModel.findOne({ '_id': id }, (err, user) => {
            if (err) console.log(err)
            done(err, user)
        })
    })

    passport.use(new GoogleStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL
    }, (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            UserModel.findOne({ 'google_id': profile.id }, async (err, user) => {
                if (err) console.log(err)
                if (user) return done(null, user)

               let userModel = new UserModel({
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    token: token,
                    google_id: profile.id,
                    creation_date: new Date(),
                })

                userModel.save()

                return done(null, userModel)
            })
        })
    }))
}