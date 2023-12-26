const { AdminModel } = require("../db/index");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  let adminToken = req.headers.authorization;
  // remove the string Bearer from the token string
  adminToken = adminToken.replace("Bearer ", "");
  const isAdminExists = await AdminModel.findOne({
    token: adminToken,
  });

  if (!isAdminExists) {
    res.status(404).json({
      message:
        "Either Admin Account doesn't exist or Email/Password is incorrect.",
    });
    return;
  } else {
    next();
  }
}

module.exports = adminMiddleware;
