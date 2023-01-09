require('dotenv').config()
const express  = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('content', (req) => JSON.stringify(req.body))

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :content',
  {
    skip: (req) => (req.method.toLowerCase() !== 'post') && (req.method.toLowerCase() !== 'put')
  }
))

app.use(morgan('tiny', {
  skip: (req) => req.method.toLowerCase() === 'post' || req.method.toLowerCase() === 'put'
}))

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

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


app.get('/info', (request,response, next) => {
  Person.count().then(c => {
    response.send(`Phonebook has info for ${c} people </br> ${new Date()}`)
  }).catch(error => next(error))
})

app.get('/api/persons', (request,response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

const validatePerson = (person) => {
  return person.name && person.number
}

app.post('/api/persons', (request,response, next) => {
  const body = request.body
  if(!validatePerson(body))
  {
    return response.status(400).json({ 'error': 'name or number missing' })
  }


  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  return newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error)
  )
})

app.put('/api/persons/:id', (request,response, next) => {
  const body = request.body

  if(!validatePerson(body))
  {
    return response.status(400).json({ 'error': 'name or number missing' })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' }).then(person => {
    if(person)
      response.json(person)
    else
      response.status(404).end()

  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request,response, next) => {
  Person.findById(request.params.id).then(person => {
    if(!person){
      response.status(404).end()
      return
    }

    response.json(person)
  })
    .catch(error => {
      return next(error)
    })
})

app.delete('/api/persons/:id', (request,response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch((error) => {
      return next(error)
    })
})

app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

