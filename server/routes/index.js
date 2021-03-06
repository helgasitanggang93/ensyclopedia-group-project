const router = require('express').Router()
const authenticate = require('../middlewares/authenticate')
const userController = require('../controllers/user-controller')
const TextAnalyzer = require('../controllers/text-analyzer')
const Youtube = require('../controllers/youtube')
const googleNews = require('../controllers/google-news')

router.post('/signup', userController.register)
router.post('/signin', userController.login)
router.post('/gSignIn', userController.googleSign)
router.get('/google-news/:title',googleNews.fetch)
router.post('/analyze', TextAnalyzer.analyze)
router.get('/youtube', Youtube.show)

module.exports = router