import Workspace from "../models/Workspace.js";
import Property from "../models/property.js";


export async function createWorkspace(req, res) {
  try {
    const { property, ...rest } = req.body;

    
    const prop = await Property.findOne({ _id: property, owner: req.user.id });
    if (!prop) return res.status(403).json({ ok: false, error: "Property not found or not yours" });

    const ws = await Workspace.create({ property, ...rest });
    res.status(201).json({ ok: true, data: ws });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
}


export async function updateWorkspace(req, res) {
  try {
    const { id } = req.params;

    
    const ws = await Workspace.findById(id).populate("property");
    if (!ws) return res.status(404).json({ ok: false, error: "Not found" });

    if (String(ws.property.owner) !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }

    Object.assign(ws, req.body);
    await ws.save();
    res.json({ ok: true, data: ws });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
}


export async function deleteWorkspace(req, res) {
  try {
    const { id } = req.params;
    const ws = await Workspace.findById(id).populate("property");
    if (!ws) return res.status(404).json({ ok: false, error: "Not found" });

    if (String(ws.property.owner) !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }

    await ws.deleteOne();
    res.json({ ok: true, data: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
}


export async function searchWorkspaces(req, res) {
  try {
    const {
      propertyId,
      address,
      neighborhood,
      minSqft,
      maxSqft,
      hasParking,
      hasTransit,
      seats,
      smokingAllowed,
      availableFrom,
      leaseTerm,
      minPrice,
      maxPrice,
      sortBy
    } = req.query;

   
    const q = {};
    if (propertyId) q.property = propertyId;
    if (seats) q.seats = { $gte: Number(seats) };
    if (smokingAllowed !== undefined && smokingAllowed !== "")
      q.smokingAllowed = smokingAllowed === "true";
    if (availableFrom) q.availableFrom = { $lte: new Date(availableFrom) };
    if (leaseTerm) q.leaseTerm = leaseTerm;
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = Number(minPrice);
      if (maxPrice) q.price.$lte = Number(maxPrice);
    }

    
    const propertyFilter = {};
    if (neighborhood) propertyFilter.neighborhood = new RegExp(neighborhood, "i");
    if (address) propertyFilter.address = new RegExp(address, "i");
    if (hasParking !== undefined && hasParking !== "") propertyFilter.hasParking = hasParking === "true";
    if (hasTransit !== undefined && hasTransit !== "") propertyFilter.hasTransit = hasTransit === "true";
    if (minSqft || maxSqft) {
      propertyFilter.squareFeet = {};
      if (minSqft) propertyFilter.squareFeet.$gte = Number(minSqft);
      if (maxSqft) propertyFilter.squareFeet.$lte = Number(maxSqft);
    }

  
    if (Object.keys(propertyFilter).length) {
      const props = await Property.find(propertyFilter).select("_id");
      const ids = props.map(p => p._id);
      q.property = propertyId ? propertyId : { $in: ids };
    }

   
    let query = Workspace.find(q).populate({
      path: "property",
      populate: { path: "owner", select: "email name phone" }
    });

    if (sortBy === "price") query = query.sort("price");
    if (sortBy === "available") query = query.sort("availableFrom");

    const results = await query.exec();
    res.json({ ok: true, data: results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
