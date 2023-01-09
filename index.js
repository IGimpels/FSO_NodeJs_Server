const express  = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/info', (request,response) => {
    response.send(`Phonebook has info for ${persons.length} people </br> ${new Date()}`);
})

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}
app.post('/api/persons', (request,response) => {
    const body = request.body
    if(!body.name || !body.number)
    {
        return response.status(400).json({"error": "name or number missing"})
    }

    if(persons.some(p => p.name === body.name))
        return response.status(409).json({ error: 'name must be unique' })

    const newPerson = {
        name: body.name,
        number: body.number ?? "",
        id: generateId()
    }
    persons.push(newPerson)
    response.json(newPerson)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person)
        response.json(person)
    else
        response.status(404).end()
    
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()    
})


const port = process.env.PORT || "3001";
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


