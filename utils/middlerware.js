const morgan  = require('morgan')
const logger = require('./logger')

morgan.token('content', (req) => JSON.stringify(req.body))
const requestGetLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :content',
  {
    skip: (req) => (req.method.toLowerCase() !== 'post') && (req.method.toLowerCase() !== 'put')
  }
)

const requestPostLogger = morgan('tiny', {
  skip: (req) => req.method.toLowerCase() === 'post' || req.method.toLowerCase() === 'put'
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'MongoServerError' && error.code === 11000)
    return response.status(409).json({ error: `${error.keyValue.name} already exists in phonebook` })

  next(error)

}

module.exports = {
  requestGetLogger ,
  requestPostLogger ,
  unknownEndpoint,
  errorHandler
}