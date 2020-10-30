const dotenv = require('dotenv');
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
require("./config/database")

// router
const userRouter = require('./routes/user')

const app = express()
dotenv.config();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.use("/user", userRouter)

app.listen(3000,()=>{
    console.log("Server is running!")
})