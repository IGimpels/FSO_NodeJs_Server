const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    unique: true,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (number) => /^\d{2,3}-\d{4,}$/.test(number),
      message: () => 'invalid phone number format (expecting: xx-xxxxx or xxx-xxxx)'
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)