import Property from "../models/property.js";

export async function createProperty(req, res) {
  try {
    const body = { ...req.body, owner: req.user.id };
    const prop = await Property.create(body);
    res.status(201).json({ ok:true, data:prop });
  } catch (e) {
    res.status(400).json({ ok:false, error:e.message });
  }
}

export async function myProperties(req, res) {
  try {
    const props = await Property.find({ owner: req.user.id })
      .populate("workspaces")     
      .sort("-createdAt");
    res.json({ ok:true, data:props });
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
}

export async function updateProperty(req, res) {
  try {
    const { id } = req.params;
    const updated = await Property.findOneAndUpdate(
      { _id:id, owner:req.user.id },
      req.body,
      { new:true }
    ).populate("workspaces");        
    if (!updated) return res.status(404).json({ ok:false, error:"Not found" });
    res.json({ ok:true, data:updated });
  } catch (e) {
    res.status(400).json({ ok:false, error:e.message });
  }
}


export async function deleteProperty(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Property.findOneAndDelete({ _id:id, owner:req.user.id });
    if (!deleted) return res.status(404).json({ ok:false, error:"Not found" });
    res.json({ ok:true, data:true });
  } catch (e) {
    res.status(400).json({ ok:false, error:e.message });
  }
}
