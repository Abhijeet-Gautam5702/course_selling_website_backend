const { UserModel } = require("../db/index");

async function userMiddleware(req, res, next) {
  let userToken = req.headers.authorization;
  userToken = userToken.replace("Bearer ", "");
  const isUserExists = await UserModel.findOne({
    token: userToken,
  });

  if (!isUserExists) {
    res.status(404).json({
      message:
        "Either You have not signed up or User Credentials are incorrect.",
    });
    return;
  } else {
    next();
  }
}

module.exports = userMiddleware;
