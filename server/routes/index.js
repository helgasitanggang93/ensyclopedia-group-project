const router = require('express').Router()
const authenticate = require('../middlewares/authenticate')
const userController = require('../controllers/user-controller')
const TextAnalyzer = require('../controllers/text-analyzer')

router.post('/signup', userController.register)
router.post('/signin', userController.login)

router.post('/analyze', TextAnalyzer.analyze)

module.exports = router