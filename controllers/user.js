const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const user = require("../models/user")

dotenv.config()

exports.login = (req,res) =>{
    user.findOne({ $or:[{'username':req.body.user}, {'email':req.body.user}]},(err,doc)=>{
        if (err) return res.status(500).send('Internal server error.')
        if (!doc) return res.status(404).send('User not found.')
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            doc.password
        )

        if (!passwordIsValid){
            res.status(401).send('Invalid credentials.')
        }
            
        const token = jwt.sign({
            id:doc._id,
            role:doc.role
        },
        process.env.SECRET_KEY,{expiresIn: 86400})

        res.status(200).send({
            message: 'Success',
            token
        })
            
    })
}

exports.register = (req,res) =>{
    const { username, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)

    user.create({
        username:username,
        password: hashedPassword,
        email:email
    },(err,doc)=>{
        if(err){
            res.send(err)
        }else{
            res.send(doc)
        }
    })
}