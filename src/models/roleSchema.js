import mongoose from "mongoose";

const { Schema } = mongoose;

export const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
});

const Role = mongoose.model("Role", RoleSchema);

export default Role;
