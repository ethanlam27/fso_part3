require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const db = require('./models/db')
const { response } = require('express')


// -- MIDDLEWARE --

// populates req.body by parsing application/json
app.use(express.json())

morgan.token('postbody', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postbody'))
app.use(express.static('build'))

// -- ROUTES --

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    db.connectToDB()
    db.PrsonModel.find({})
        .then(result => {
            const numEntries = result.length
            res.send(`<p>Phonebook has info for ${numEntries} people</p><p>${new Date()}</p>`)
            db.closeDB()
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
    db.connectToDB()
    db.PrsonModel.find({})
        .then(result => {
            res.json(result)
            db.closeDB()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    // string
    const desiredID = req.params.id

    db.connectToDB()
    db.PrsonModel.findById(desiredID)
        .then(result => {
            res.json(result)
            db.closeDB()
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    db.connectToDB()
    db.PrsonModel.findByIdAndRemove(id)
        .then(result => {
            res.status(204).end()
            db.closeDB()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const note = req.body

    if (!note.name || !note.number) {
        res.status(400).json({
            error: 'name and number must exist'
        })
    } else {
        const prsonToAdd = new db.PrsonModel({
            name: note.name,
            number: note.number
        })

        db.connectToDB()
        prsonToAdd.save()
            .then(savedPrson => {
                res.json(savedPrson)
                db.closeDB()
            })
            .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const person = 
        {
            name: req.body.name,
            number: req.body.number
        }

    db.connectToDB()
    db.PrsonModel.findOneAndUpdate({_id: id}, person, {new: true})
        .then(updatedPerson => {
            console.log(updatedPerson)
            res.json(updatedPerson)
            db.closeDB()
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error('error message: ', error.message)
    
    if (error.name === 'ValidationError') {
        return response
            .status(400)
            .json({error: error.message})
    }

    next(error)
  }
  
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

