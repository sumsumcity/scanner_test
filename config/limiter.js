const { rateLimit } = require('express-rate-limit')

const limit = rateLimit({
    windowMs: 1000 * 60,   // 1 minute
    max: 200,              // 200 requests per minutes
    standardHeaders: true,
    legacyHeaders: false
})

const signUpLimit = rateLimit({
    windowMs: 1000 * 60,   // 1 minute
    max: 10,               // 10 signups per minute
    standardHeaders: true,
    legacyHeaders: false
})

const signInLimit = rateLimit({
    windowMs: 1000 * 60,   // 1 minute
    max: 10,               // 10 signups per minute
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = {
    limit,
    signUpLimit,
    signInLimit
}