const express = require("express");
const userModel = require("../models/userModel");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, color, img } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 400,
        message: "Name yozmastan yubording!",
      });
    }

    const newUser = await userModel({ name, color, img });
    newUser.save()

    res.status(201).json({
        message: "account successfully registered!",
        status: 201,
        data: newUser
    })
  } catch (e) {
    console.log("Server error");
    res.status(500).json("SERVER ERROR");
  }
});

module.exports = router
