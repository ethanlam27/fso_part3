const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('postbody', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postbody'))
app.use(express.static('build'))

let notes = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-23",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23",
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${notes.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find( note => note.id === id)

    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})


const genID = () => {
    return Math.ceil(Math.random() * 100000)
}


app.post('/api/persons', (req, res) => {
    const note = req.body
    const duplicateNote = notes.find( n => n.name === note.name)
    note.id = genID()

    if (!note.name || !note.number) {
        res.status(400).json({
            error: 'name and number must exist'
        })
    } else if (duplicateNote) {
        res.status(400).json({
            error: 'name must be unique'
        })
    } else {


        notes = notes.concat(note)
        res.json(note)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

