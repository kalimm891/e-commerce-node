const helper = require("../utils/helper");
const {Newuser} = require("../models")
const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
  try {
    let token = helper.getCookieUser(req);
    if (token) {
      decodeToken = jwt.verify(token,"@eshop");
      if (decodeToken) {
        let userData = await Newuser.findOne({ where: { id: decodeToken.id } });
        if (userData) {
          req.userData = userData;
          return next();
        } else {
          console.log("No admin found");
        }
      } else {
        console.log("Invalid token provided");
      }
      return next();
    } else {
      const { error, message } = req.query;
      console.log("Undefined Token");
      return res.render("auth/login.ejs", { error, message });
    }
  } catch (error) {
    next(error);
  }
};

