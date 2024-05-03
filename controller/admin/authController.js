
const {Cart, Category, Product, Newuser } = require("../../models")










// exports.loginGet = async (req, res) => {
//     console.log("result  ")
//     try {

//         const newData = await Newuser.findAll();
//         return res.render("main/user.ejs", {data:newData});
//     } catch (err) {
//         console.log(err)
//         return res.status(500).send({
//         error: "error "
//         });        
//     }
// }
exports.UserGet = async (req, res) => {
    console.log("result  ")
    try {

        const newData = await Newuser.findAll();
        return res.render("main/user.ejs", {data:newData});
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}




