const express = require("express");
const userModel = require("../models/userModel");
const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { name, color, img } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 400,
        message: "Name yozmastan yubording!",
      });
    }

    let user = await userModel.findOne({ name });

    if (!user) {
      // Agar user topilmasa, yangi user ochiladi
      user = new userModel({ name, color, img });
      await user.save();
    }

    res.status(200).json({
      message: "Login successful!",
      status: 200,
      data: user,
    });
  } catch (e) {
    console.log("Server error:", e.message);
    res.status(500).json("SERVER ERROR");
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, color, image, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Name yoki password yozmadin!" });
    }

    const boruser = userModel.findOne({ name: username });

    if (!boruser) {
      return res.status(409).json({
        message: "Bunday akkaunt mavjud! boshqa username kiriting!",
      });
    }

    const newUser = new userModel({ name: username, color, img: image });
    newUser.save();

    res.status(201).json({
      message: "Successfully created!",
      newUser,
    });
  } catch (e) {
    console.log("error: ", e);
  }
});

module.exports = router;
