const User = require("./userModel");

const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// signs the user's id using the JWT_SECRET and returns it as the token
const createSendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user = {
    name: user.name,
    _id: user._id,
    userType: user.userType,
  };

  res.status(201).json({
    status: "success",
    user,
    token,
  });
};

// decodes the token using the JWT_SECRET and checks that the requester exists in the user db
const checkForUserAuthorization = (rolesArr) => {
  return async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      //throw an error here
      return res
        .status(401)
        .json({ status: "Unauthorised", message: "No valid token" });
    }

    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(500).json({ status: "failed", message: err });
    }

    // CHECK IF USER EXISTS
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res
        .status(401)
        .json({ status: "Unauthorised", message: "No valid token" });
    } else if (rolesArr.includes(freshUser.userType)) {
      req.body.requester = freshUser;
      next();
    } else {
      return res.status(401).json({
        status: "Unauthorised",
        message: "User's role is unauthorised",
      });
    }
  };
};

const signupHandler = async (req, res, next) => {
  const existingUser = await User.findOne({ name: req.body.name });

  if (existingUser) {
    return res.status(500).json({
      status: "Failed",
      message: "User with this name already exists",
    });
  }

  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    userType:
      req.body.userType && req.body.userType === "Admin" ? "Admin" : "User",
  });
  createSendToken(newUser, res);
};

const loginUser = async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).json({
      status: "No username or password",
    });
  }

  const user = await User.findOne({ name }).select("+password");
  const same = user ? await bcrypt.compare(password, user.password) : false;
  if (!same) {
    return res.status(401).json({
      status: "Username or Password is incorrect",
    });
  }
  createSendToken(user, res);
};

module.exports = { signupHandler, loginUser, checkForUserAuthorization };
