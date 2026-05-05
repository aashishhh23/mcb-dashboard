//  mongoose import
const mongoose = require("mongoose");

//  connect function
const connectDB = async () => {
  try {

    await mongoose.connect("mongodb://127.0.0.1:27017/mcb-dashboard");

    console.log("MongoDB Connected");

  } catch (error) {
    console.log(" DB Error:", error.message);
  }
};

module.exports = connectDB;