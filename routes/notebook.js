const checkToken = require('../middlewere/auth')
const {
    getUserNotebook,
    updateUserNotebook,
    getTotalPages
} = require('../controllers/notebook')
express = require('express')
router = express.Router()

//controller imports
//routes
//userNotebook -GET -UPDATE
//totalPages
router.use(checkToken)

router.get('/userNotebook',getUserNotebook)
router.put('/userNotebook',updateUserNotebook)
router.get('/userNotebook/totalPages',getTotalPages)
//router.get('/totalPages',totalPages)

module.exports = router