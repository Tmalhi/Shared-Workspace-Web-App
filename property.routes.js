import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createProperty, myProperties, updateProperty, deleteProperty } from "../controllers/property.controller.js";

const r = Router();
r.post("/", auth(true), createProperty);
r.get("/mine", auth(true), myProperties);
r.put("/:id", auth(true), updateProperty);
r.delete("/:id", auth(true), deleteProperty);
export default r;
