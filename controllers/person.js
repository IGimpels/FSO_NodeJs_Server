
const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('/', (request,response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

const validatePerson = (person) => {
  return person.name && person.number
}

personRouter.post('/', (request,response, next) => {
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

personRouter.put('/:id', (request,response, next) => {
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

personRouter.get('/:id', (request,response, next) => {
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

personRouter.delete('/:id', (request,response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch((error) => {
      return next(error)
    })
})

module.exports = personRouter