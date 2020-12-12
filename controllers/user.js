const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const user = require("../models/user")
dotenv.config()

exports.login = (req,res) =>{
    user.findOne({ $or:[{'username':req.body.email}, {'email':req.body.email}]},(err,doc)=>{
        if (err) return res.send('Internal server error.')
        if (!doc) return res.send({
            status:200,
            msg:"User Not Found!",
            token:null,
            error:false
        })
        
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            doc.password
        )

        if (!passwordIsValid){
            return res.send({
                status:200,
                msg:"Invalid Credentials",
                token:null,
                error:false
            })
        }
            
        const token = jwt.sign({
            id:doc._id,
            role:doc.role
        },
        process.env.SECRET_KEY,{expiresIn: 86400})

        res.status(200).send({
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
                status:200,
                msg:err,
                token:null,
                error:true
            }))
        }else{
            const token = jwt.sign({
                id:doc._id,
                role:doc.role
            },
            process.env.SECRET_KEY,{expiresIn: 86400})
            res.send(res.status(200).send({
                status:200,
                msg:"Success",
                token:token,
                error:false
            }))
        }
    })
}