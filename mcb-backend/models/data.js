const mongoose = require("mongoose");

// schema (data structure)
const dataSchema = new mongoose.Schema(
  {
    voltage: Number,
    current: Number,
    pf: Number,
    temp: Number,
    tripTime: Number,
  },
  {
    timestamps: true, 
    //  Mongoose automatically adds:
    // createdAt + updatedAt
    // more reliable than manual field
  }
);

// model
module.exports = mongoose.model("Data", dataSchema);