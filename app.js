require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//Modules
const app = express()

/// config JSON 
app.use(express.json())

//routers
authRouter = require('./routes/auth')
notebookRouter = require('./routes/notebook')
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/note',notebookRouter)
///Credenciais
dbUser = process.env.DB_USER
dbPass = process.env.DB_PASS
const port = process.env.PORT
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.5uytm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    app.listen(port, ()=>{console.log(`listening to the port ${port}...`)})
}
).catch((err) => { console.log(err) })

// quais recursos da API
// getUserNotebook