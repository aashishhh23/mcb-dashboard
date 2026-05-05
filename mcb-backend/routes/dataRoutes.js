const express = require("express");
const router = express.Router();

// import controller
const {
  getData,
  getLastMinutes,
} = require("../controllers/dataController");

//  routes
router.get("/data", getData);
router.get("/data/:minutes", getLastMinutes);

module.exports = router;