import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function signup(req, res) {
  try {
    const { name, email, phone, role, password } = req.body;
    if (!name || !email || !role || !password)
      return res.status(400).json({ ok:false, error:"Missing required fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ ok:false, error:"Email already registered" });

    const user = new User({ name, email, phone, role, passwordHash:"" });
    await user.setPassword(password);
    await user.save();

    const token = jwt.sign({ id:user._id, role:user.role, name:user.name }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.json({ ok:true, data:{ token, user:{ id:user._id, name, email, role } } });
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ ok:false, error:"Invalid credentials" });

    const token = jwt.sign({ id:user._id, role:user.role, name:user.name }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.json({ ok:true, data:{ token, user:{ id:user._id, name:user.name, email:user.email, role:user.role } } });
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
}
