const express = require('express')
const morgan = require('morgan')
const app = express()





// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }


// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }


morgan.token('jsonBody', function getBody (req) {
  if (req.method !== 'POST') {
    return null
  }else{
    return JSON.stringify(req.body)
  }
})

app.use(express.json())
// app.use(requestLogger)
// app.use(unknownEndpoint)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonBody'))

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
      error: 'Malformed json sent; pleasue assure both name and number are provided' 
    })
  }

  if (phonebook.find(person => person.name === body.name)) { 
    return response.status(403).json({ 
      error: 'Name must be unique'
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