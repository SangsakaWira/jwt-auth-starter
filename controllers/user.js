const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const user = require("../models/user")
dotenv.config()

let userData = {
    status:200,
    msg:"Success",
    token:"",
    error:false
}

exports.login = (req,res) =>{
    user.findOne({ $or:[{'username':req.body.username}, {'email':req.body.username}]},(err,doc)=>{
        if (err) return res.status(500).send('Internal server error.')
        if (!doc) return res.status(404).send({
            ...userData,
            status:200,
            msg:"User Not Found!",
            token:"",
            error:false
        })
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            doc.password
        )

        if (!passwordIsValid){
            return res.status(200).send({
                ...userData,
                status:200,
                msg:"Invalid Credentials",
                token:"",
                error:false
            })
        }
            
        const token = jwt.sign({
            id:doc._id,
            role:doc.role
        },
        process.env.SECRET_KEY,{expiresIn: 86400})

        res.status(200).send({
            ...userData,
            status:200,
            msg:"Success",
            token:token,
            error:false
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
            return res.send(res.status(200).send({
                ...userData,
                status:200,
                msg:err,
                token:"",
                error:true
            }))
        }else{
            const token = jwt.sign({
                id:doc._id,
                role:doc.role
            },
            process.env.SECRET_KEY,{expiresIn: 86400})
            res.send(res.status(200).send({
                ...userData,
                status:200,
                msg:"Success",
                token:token,
                error:false
            }))
        }
    })
}