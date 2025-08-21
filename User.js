import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type:String, required:true },
  email: { type:String, required:true, unique:true, lowercase:true, trim:true },
  phone: { type:String },
  role: { type:String, enum:["owner", "coworker"], required:true },
  passwordHash: { type:String, required:true }
}, { timestamps:true });

userSchema.methods.setPassword = async function (pw) {
  this.passwordHash = await bcrypt.hash(pw, 10);
};
userSchema.methods.comparePassword = async function (pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

export default mongoose.model("User", userSchema);
