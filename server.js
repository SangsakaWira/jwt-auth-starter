const dotenv = require('dotenv');
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()
dotenv.config();

mongoose.connect('mongodb://localhost/jwt-database', {
	useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () => console.log('DB connected'))
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// router
const userRouter = require('./routes/user')

app.use(express.static(__dirname + '/public'))

app.use("/user", userRouter)
app.listen(3000,()=>{
    console.log("Server is running!")
})