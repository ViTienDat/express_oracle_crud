const express = require("express")
require("dotenv").config()
const cors = require("cors")
const app = express()
const initRouter = require("./src/router")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

initRouter(app)

const port = process.env.PORT || 5001

app.listen(port, () => console.log("App running in port:", port))
