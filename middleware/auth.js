
const {getUserId} = require("../service/auth_service")

async function restrcitLogin (req, res, next){
    const userId = req.cookies?.uid;
    if(!userId) return res.redirect("/api/login-get");
    const user =  getUserId(userId);
    if(!user) return res.redirect("/api/login-get");
    req.user = user;
    next();
}







module.exports = {
    restrcitLogin,
}