import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required:true },
  type: { type:String, enum:["meeting_room","private_office","desk"], required:true },
  seats: { type:Number, required:true },
  smokingAllowed: { type:Boolean, default:false },
  availableFrom: { type:Date, required:true },
  leaseTerm: { type:String, enum:["day","week","month"], required:true },
  price: { type:Number, required:true },
  ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, value: { type:Number, min:1, max:5 } }],
  reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, text: String }]
}, { timestamps:true });

workspaceSchema.virtual("avgRating").get(function () {
  if (!this.ratings?.length) return null;
  const sum = this.ratings.reduce((a,r)=>a+r.value, 0);
  return Number((sum / this.ratings.length).toFixed(2));
});

export default mongoose.model("Workspace", workspaceSchema);
