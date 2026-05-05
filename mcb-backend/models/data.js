const mongoose = require("mongoose");

//  schema (data structure)
const dataSchema = new mongoose.Schema({

  voltage: Number,
  current: Number,
  pf: Number,
  temp: Number,
  tripTime: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

//  model
module.exports = mongoose.model("Data", dataSchema);