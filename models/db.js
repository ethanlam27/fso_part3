const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const prsonSchema = new mongoose.Schema({
    name: 
    {
        type: String,
        unique: true,
        required: true
    },

    number: 
    {
        type: String,
        required: true
    }
})
// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

prsonSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const connectToDB = () => {
    const url = process.env.MONGO_URL
    console.log('connecting to ', url)

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(result => {
            console.log('connected to MongoDB')
        })
        .catch( error => {
            console.log('error connecting to MongoDB: ', error.message)
        })
}

const closeDB = () => {
    mongoose.connection.close()
    console.log('connection to MongoDB closed')
}

/*
switch (process.argv.length) {

    case 3:
        console.log('case 3 enter')
        connectToDB(process.argv[2], "phonebook")

        PrsonModel.find({}).then(result => {
            result.forEach(person => {
              console.log(person)
            })
            mongoose.connection.close()
          })
        break;

    case 5:
        console.log('case 5 enter')
        connectToDB(process.argv[2], "phonebook")

        // parse person info from cmdline
        const nameToAdd = process.argv[3]
        const numberToAdd = process.argv[4]
        const prsonToAdd = new PrsonModel({
            name: nameToAdd,
            number: numberToAdd
        })

        prsonToAdd.save().then(response => {
            console.log(`added ${response.name} number ${response.number} to phonebook`)
            mongoose.connection.close()
        })
        break;

    default:
        console.log('wrong number of arguments')
        process.exit(1)
}

*/

module.exports.PrsonModel = mongoose.model('Prson', prsonSchema)
module.exports.connectToDB = connectToDB
module.exports.closeDB = closeDB