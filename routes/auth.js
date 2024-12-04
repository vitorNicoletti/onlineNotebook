express = require('express')
route = express.Router()
//controller imports
const {
    loginUser,
    registerUser
} = require('../controllers/auth')

route.post('/register', registerUser)

route.post('/login',loginUser)

module.exports = route