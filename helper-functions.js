const requireUser = (req, res, next) => {
    if (req.isAuthenticated()) return next()

    else return res.sendStatus(401)
}

module.exports = {
    requireUser
}