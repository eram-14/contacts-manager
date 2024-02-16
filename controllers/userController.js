const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//@desc Register a User
//@route POST /api/user/register 
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("All Fields are mandatory")
    }
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error("User already Registered!!!")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })
    if (user) {
        res.status(201).json({ _id: user._id, username: user.username, email: user.email })
    } else {
        res.status(400)
        throw new Error("Invalid Data")
    }
})

//@desc Register a User
//@route POST /api/user/login 
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("All Fields are mandatory")
    }
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                _id: user._id,
            }
        },
            process.env.ACCESS_TOKEN,
            { expiresIn: '15m' }
        )
        res.status(200).json(accessToken)
    } else {
        res.status(401)
        throw new Error("Email or Password not Valid!!!")
    }

})

//@desc Register a User
//@route GET /api/user/current 
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

module.exports = { registerUser, loginUser, currentUser } 