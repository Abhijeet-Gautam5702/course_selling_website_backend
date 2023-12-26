const express = require("express");
const bodyParser = require("body-parser");

// importing the admin and user router
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(express.json());

// Loading the admin and user routers
// importing admin.js automatically creates routes starting with "/admin". Rest all the routes (as defined in admin.js) will be appended after the "/admin" route
app.use("/admin", adminRouter);
// importing user.js automatically creates routes starting with "/user". Rest all the routes (as defined in user.js) will be appended after the "/user" route
app.use("/user", userRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
