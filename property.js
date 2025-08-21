import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },
  address: { type:String, required:true },
  neighborhood: { type:String },
  squareFeet: { type:Number },
  hasParking: { type:Boolean, default:false },
  hasTransit: { type:Boolean, default:false },
  photos: [String],
}, { timestamps:true });


propertySchema.virtual("workspaces", {
  ref: "Workspace",
  localField: "_id",
  foreignField: "property"
});


propertySchema.set("toObject", { virtuals: true });
propertySchema.set("toJSON", { virtuals: true });

export default mongoose.model("Property", propertySchema);

