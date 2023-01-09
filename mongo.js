const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }

  const password = process.argv[2]
  const url = `mongodb+srv://fullstack:${password}@cluster0.c1unoy9.mongodb.net/phonebookApp?retryWrites=true&w=majority`

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = new mongoose.model('Person', personSchema)

  const listAll = () => {
    mongoose.connect(url).then(() => {
        Person.find({}).then((persons) => {
            persons.forEach(p => {
                console.log(p)                
            });
            mongoose.connection.close()
        })
    })
  }

  const addPerson = (name, number) => {
    mongoose.connect(url).then(() => {
        const person = new Person({
            name,
            number: number ?? ""
        })
        return person.save()
    }).then((p)=>{
        console.log(`Added ${p.name} ${p.number}`)
        mongoose.connection.close()
    }).catch((err) => console.log(err))
  }


  if(process.argv.length === 3) {
    listAll()
    return
  }

  addPerson(process.argv[3], process.argv[4])

