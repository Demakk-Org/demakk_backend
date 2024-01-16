import express from "express";
import dotenv from 'dotenv'
import userRoute from "./src/routes/UserRouter/userRoute.js";

const PORT = dotenv.config(process.cwd, '.env').parsed.PORT

console.log(PORT)

const app = express()

app.use('/api/v1/user', userRoute)

app.listen(PORT, ()=>{
  console.log(`Server is running on port : ${PORT}`)
})
