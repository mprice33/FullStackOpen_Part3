const express = require('express')
const app = express()

app.use(express.json())

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  //const maxId = phonebook.length > 0
  //  ? Math.max(...phonebook.map(n => Number(n.id)))
  //  : 0

  const randId = Math.round(Math.random() * 10000000000000)

  const body = request.body
   
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Malformed json provided' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: randId,
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  response.send(`<p> Phonebook has info for ${phonebook.length} people </p> <p>${new Date()}</p> `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})