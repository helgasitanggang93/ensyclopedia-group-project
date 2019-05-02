const router = require('express').Router()
const authenticate = require('../middlewares/authenticate')
const userController = require('../controllers/user-controller')

router.post('/signup', userController.register)
router.post('/signin', userController.login)

module.exports = router