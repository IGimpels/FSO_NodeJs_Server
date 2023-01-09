const express  = require('express')
const app = express()

app.use(express.json())

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
    return persons.length === 0 ? 1 : (Math.max(...persons.map(p => p.id)) + 1)
}
app.post('/api/persons', (request,response) => {
    const body = request.body
    if(!body.name)
    {
        return response.status(400).json({"error": "name missing"})
    }

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


app.listen(3001, () => {
    console.log('Server running on port 3001')
})


