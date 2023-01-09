require('dotenv').config()
const express  = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('content', (req, res) => JSON.stringify(req.body))

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :content', 
    {
        skip: (req, res) => req.method.toLowerCase() !== 'post'
    }
    ))

app.use(morgan('tiny', {
    skip: (req, res) => req.method.toLowerCase() === 'post'
}))

app.get('/info', (request,response) => {
    Person.count().then(c => {
        response.send(`Phonebook has info for ${c} people </br> ${new Date()}`);
    })    
})

app.get('/api/persons', (request,response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request,response) => {
    const body = request.body
    if(!body.name || !body.number)
    {
        return response.status(400).json({"error": "name or number missing"})
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })

    /*Person.findOne({"name": body.name}).then(p=>{
        if(p) {
            response.status(409).json({ error: 'name must be unique' })
            return
        }
        const newPerson = new Person({
            name: body.name,
            number: body.number
        })
        newPerson.save().then(savedPerson => {
            response.json(savedPerson)
        })
    })*/
})

app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    .catch(() =>{
        response.status(404).end()
    })  
})

app.delete('/api/persons/:id', (request,response) => {   
    Person.findByIdAndDelete(request.params.id).then(p => {
        response.status(204).end() 
    })
    .catch(() => {
        response.status(204).end()    
    })
})


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


