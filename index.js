const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const connectDB = require('./config/dbConfig')
const env = require('dotenv').config()

const PORT = process.env.PORT

connectDB()
const app = express()

app.use(express.json())
app.use('/api/contacts',require('./routes/contactRoutes.js'))
app.use('/api/users',require('./routes/userRoutes.js'))

app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`)
})