import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createWorkspace, updateWorkspace, deleteWorkspace, searchWorkspaces } from "../controllers/workspace.controller.js";

const r = Router();
r.get("/search", searchWorkspaces);               // public search
r.post("/", auth(true), createWorkspace);         // owner only (by property check)
r.put("/:id", auth(true), updateWorkspace);
r.delete("/:id", auth(true), deleteWorkspace);
export default r;
