const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const { AdminModel, CourseModel } = require("../db/index");

// Unique JWT password used to verify the token
const jwtPassword = "jwtPassword";

// Admin Routes

router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // create the instance of admin model
  const newAdmin = new AdminModel({
    username: username,
    password: password,
    // Create a unique JWT token for the admin
    token: jwt.sign({ username: username }, jwtPassword),
  });

  // find if the admin exists in the database
  const isAdminExists = await AdminModel.findOne({
    username: username,
    password: password,
  }).exec();

  // if admin exists => check if the password is correct
  if (isAdminExists) {
    // console.log(isAdminExists._id);
    res.status(409).json({
      message: "Admin already exists in the database. Please Sign In.",
    });
    return;
  }
  // if admin doesn't exist => create user into the database using mongoose
  else {
    await newAdmin.save();
    res.status(201).json({
      message: "Admin created successfully.",
    });
  }
});

router.post("/signin", async (req, res) => {
  // Fetch the token of the user from the database and display to the client
  const username = req.body.username;
  const password = req.body.password;

  // find if the admin account (with correct password) exists in the database
  const admin = await AdminModel.findOne({
    username: username,
    password: password,
  }).exec();

  // If admin doesn't exist => Send a message to Sign Up
  if (!admin) {
    res.status(404).json({
      message: "Admin Account not found in our database. Please Sign Up.",
    });
    return;
  } else {
    const adminToken = admin.token;

    res.status(200).json({
      token: adminToken,
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Fetch the admin credentials from the header
  let adminToken = req.headers.authorization;
  // remove the string Bearer from the token string
  adminToken = adminToken.replace("Bearer ", "");
  // Search for the admin in the database
  const isAdminExists = await AdminModel.findOne({
    token: adminToken,
  });

  // If admin exists =>
  // ::: Fetch the course details from the body
  // ::: Create a document with the fetched details from the CourseModel. Set the CourseID as adminID.
  const title = req.body.title;
  const description = req.body.description;
  const price = parseFloat(req.body.price);
  const imageLink = req.body.imageLink;
  const id = Math.random().toFixed(6);

  const newCourse = new CourseModel({
    title: title,
    description: description,
    price: price,
    imageLink: imageLink,
    id: id,
    adminId: isAdminExists._id,
  });

  await newCourse.save();
  res.status(201).json({
    message: "Course created successfully",
    courseId: id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Fetch the admin credentials from the header
  let adminToken = req.headers.authorization;
  // remove the string Bearer from the token string
  adminToken = adminToken.replace("Bearer ", "");
  // Search for the admin in the database
  const isAdminExists = await AdminModel.findOne({
    token: adminToken,
  });

  // If admin exists =>
  // :: Fetch the adminID
  // Iterate through the courses in the database and fetch those with adminID
  const adminId = isAdminExists._id.toString();
  const coursesList = await CourseModel.find({ adminId: adminId });

  res.status(200).json({
    admin: isAdminExists.username,
    courses: coursesList,
  });
});

module.exports = router;
