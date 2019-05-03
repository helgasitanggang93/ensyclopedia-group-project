require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const userRoutes = require('./routes')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/enscylopedia-group-project', { useNewUrlParser: true })
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/', userRoutes)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})