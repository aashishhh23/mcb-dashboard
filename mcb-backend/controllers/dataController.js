//  Import model
const Data = require("../models/data");

// --------------------------------------
//  GET ALL DATA (LIMITED)
// --------------------------------------
exports.getData = async (req, res) => {
  try {

    const minutes = parseInt(req.params.minutes);

    //  WHY:
    // Convert string → number for calculations
    if (isNaN(minutes)) {
      return res.status(400).json({ error: "Invalid time filter" });
    }

    const timeAgo = new Date(Date.now() - minutes * 60 * 1000);

const data = await Data.find({
  createdAt: { $exists: true, $gte: timeAgo }
})
.sort({ createdAt: -1 })
.limit(50);

    res.json(data);

  } catch (error) {
    console.log("Time filter error:", error.message);
    res.status(500).json({ error: "Time filter failed" });
  }
};


// --------------------------------------
//  GET LAST N MINUTES DATA (ADVANCED)
// --------------------------------------
exports.getLastMinutes = async (req, res) => {
  try {

    const minutes = parseInt(req.params.minutes);

    if (isNaN(minutes)) {
      return res.status(400).json({ error: "Invalid time filter" });
    }

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
    console.log("ERROR:", err.message);
    res.status(500).json({ error: "Time filter failed" });
  }
};