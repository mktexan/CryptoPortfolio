module.exports = {
    googleAuth: {
        'clientID': process.env.clientID,
        'clientSecret': process.env.clientSecret,
        'callbackURL'   : 'http://localhost:7020/auth/google/callback'
    }
};