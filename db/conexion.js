const mongoose = require('mongoose')

const url = 'mongodb+srv://LordMaster:Daredevil2022@cluster0.f9kkcx6.mongodb.net/ChurrasqueriaHerencia'

mongoose.connect(url,{
    useNewUrlParser: true, 

    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error',console.error.bind(console,'Error al conectar con mongoDB'))
db.once('open',function callback() {
    
})
module.exports = db