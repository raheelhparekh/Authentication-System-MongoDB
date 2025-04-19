import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"

// import all routes
import userRoutes from "./routes/User.routes.js"

dotenv.config()

const app = express()

app.use(cors({
    origin:process.env.BASE_URL,
    methods:["GET","POST","UPDATE","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))

app.use(express.json()) // accepts json values
app.use(express.urlencoded({extended:true})) // from url when you get %20 which means so to understand url encoded is required

const port = process.env.PORT || 4000


// connect to db
db();

app.use("/api/v1/users/",userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})