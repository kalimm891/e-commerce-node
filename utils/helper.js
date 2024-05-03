



module.exports = {
    getCookieUser(req){
        var cookie = req.cookies;
        if(cookie){
            if(Object.keys(cookie).includes("user-token")){
                return cookie['user-token']
            }else{
                return false;
            }
        }
    }
}