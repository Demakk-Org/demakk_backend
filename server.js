import express from "express";
import dotenv from 'dotenv'

const PORT = dotenv.config(process.cwd, '.env').parsed.PORT

console.log(PORT)

const app = express()

app.listen(PORT, ()=>{
  console.log(`Server is running on port : ${PORT}`)
})