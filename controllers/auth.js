require('dotenv').config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
//Modules
const User = require('../models/User')

const loginUser =  async (req, res) => {
    const { email, password } = req.body
    ///validations
    if (!email) {
        return res.status(422).json("email is mandatory")
    }
    if (!password) {
        return res.status(422).json("email is mandatory")
    }

    //check if user exists
    const userExists = await User.findOne({ email: email })

    if (!userExists) {
        return res.status(404).json("user dont exists")
    }

    const checkpassword = await bcrypt.compare(password, userExists.password)
    console.log(checkpassword)
    if (!checkpassword) {
        return res.status(422).json({ content: "Senha incorreta" })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: userExists._id
            }, secret
        )
        res.status(200).json({
            content: "Authentication was sucessfull",
            token: token
        })
    }
    catch (err) {
        console.log(error)

        res
            .status(500)
            .json({ content: "error" })
    }
}

const registerUser = async (req, res) => {

    const { name, email, password, confirmpassword } = req.body

    ///validations
    if (!name) {
        return res.status(422).json("name is mandatory")
    }
    if (!email) {
        return res.status(422).json("email is mandatory")
    }
    if (!password) {
        return res.status(422).json("email is mandatory")
    }
    if (password != confirmpassword) {
        return res.status(422).json("passwords given are different")
    }

    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json("user already exists")
    }

    //create password

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create User

    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        await user.save()

        res.status(201).json({ content: "user created sucessfully!" })
    }
    catch (err) {
        console.log(error)

        res
            .status(500)
            .json({ content: "error" })
    }
}

module.exports = {
    loginUser,
    registerUser
}