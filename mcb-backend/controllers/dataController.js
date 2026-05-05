//  Import model
const Data = require("../models/data");

// --------------------------------------
//  GET ALL DATA (LIMITED)
// --------------------------------------
exports.getData = async (req, res) => {

  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;

    const data = await Data.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};


// --------------------------------------
//  GET LAST N MINUTES DATA (ADVANCED)
// --------------------------------------
exports.getLastMinutes = async (req, res) => {
  try {
    const minutes = Number(req.params.minutes);
    const page = Number(req.query.page) || 1;
    const limit = 20;

    const time = new Date(Date.now() - minutes * 60 * 1000);

    const data = await Data.find({
      createdAt: { $gte: time },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(data);

  } catch (err) {
    console.log("ERROR:", err.message); //  important
    res.status(500).json({ error: "Time filter failed" });
  }
};