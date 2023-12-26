const express = require("express");
const router = express.Router();
const { UserModel, CourseModel } = require("../db/index");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/user");

const jwtPassword = "jwtPassword";

// User Routes
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // create the instance of user model
  const newUser = new UserModel({
    username: username,
    password: password,
    token: jwt.sign({ username: username }, jwtPassword),
    purchasedCourses: [],
  });

  // find if the user exists in the database
  const isUserExists = await UserModel.findOne({
    username: username,
    password: password,
  }).exec();

  // if user exists => check if the password is correct
  if (isUserExists) {
    // console.log(isAdminExists._id);
    res.status(409).json({
      message: "User already exists in the database. Please Sign In.",
    });
    return;
  }
  // if user doesn't exist => create user into the database using mongoose
  else {
    await newUser.save();
    res.status(201).json({
      message: "User created successfully.",
    });
  }
});

router.post("/signin", async (req, res) => {
  // Fetch the token of the user from the database and display to the client
  const username = req.body.username;
  const password = req.body.password;

  // Find if the user account (with correct password) exists in the database
  const user = await UserModel.findOne({
    username: username,
    password: password,
  });

  // If user doesn't exist => Send a message to Sign Up
  if (!user) {
    res.status(404).json({
      message: "User Account not found in our database. Please Sign Up.",
    });
    return;
  } else {
    const userToken = user.token;

    res.status(200).json({
      token: userToken,
    });
  }
});

router.get("/courses", userMiddleware, async (req, res) => {
  const coursesList = await CourseModel.find({});
  res.status(200).json({
    courses: coursesList,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseId = parseFloat(req.params.courseId);
  // find the course from the database
  const course = await CourseModel.findOne({ id: courseId }).exec();
  if (course) {
    // find the user in the database using its token
    let userToken = req.headers.authorization;
    userToken = userToken.replace("Bearer ", "");
    const user = await UserModel.findOne({
      token: userToken,
    });

    const purchasedCourseList = user.purchasedCourses;
    purchasedCourseList.push(courseId);

    await UserModel.findOneAndUpdate(
      {
        token: userToken,
      },
      {
        purchasedCourses: purchasedCourseList,
      }
    );

    res.status(200).json({
      message: "Course Purchased Successfully",
      courseId: courseId,
    });
  } else {
    res.status(404).json({
      message: "Course not found",
    });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // find the user in the database using the token

  let userToken = req.headers.authorization;
  userToken = userToken.replace("Bearer ", "");
  const user = await UserModel.findOne({
    token: userToken,
  });

  // fetch the purchased Courses List
  const purchasedCourseList = user.purchasedCourses;

  if (purchasedCourseList.length == 0) {
    res.status(404).json({
      message: "No Courses Purchased",
    });
  }

  // For each CourseID of the purchased course, display all the details of the course
  const purchasedCourseDetails = [];
  for (let i = 0; i < purchasedCourseList.length; i++) {
    const courseId = purchasedCourseList[i];
    const course = await CourseModel.findOne({ id: courseId });
    purchasedCourseDetails.push(course);
  }

  res.status(200).json({
    "Purchased Courses": purchasedCourseDetails,
  });
});

module.exports = router;
