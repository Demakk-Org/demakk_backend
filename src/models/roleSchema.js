import mongoose from "mongoose";

const {Schema} = mongoose

const RoleSchema = Schema({
  name:{
    type:String,
    required:true
  }
})

const Role = mongoose.model("Role", RoleSchema)

export default Role
