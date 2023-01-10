const express  = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const personRouter = require('./controllers/person')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middlerware')
const Person = require('./models/person')

const url = config.MONGODB_URI

const app = express()

logger.info('connecting to', url)

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.requestGetLogger)
app.use(middleware.requestPostLogger)

app.use('/api/persons', personRouter)
app.get('/info', (request,response, next) => {
  Person.count().then(c => {
    response.send(`Phonebook has info for ${c} people </br> ${new Date()}`)
  }).catch(error => next(error))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app