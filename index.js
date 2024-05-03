const express = require('express');
const http = require('http');


const cookiesParser = require("cookie-parser")

const path = require('path');
const app=express();
const appRoutes = require("./router/app")
const adminRoutes = require("./router/admin")




const server = http.createServer(app);
// app.set('views', __dirname + '/views');
// const staticPath1 = path.join(__dirname, "./views/pages");
// app.set("view engine", "ejs");
// app.set("views",staticPath1);


// console.log(path.join(__dirname, "./public"));
console.log("hello  i am going");


const staticPath = path.join(__dirname, "./public");



app.use('/api', express.static(staticPath));

app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use("/public", express.static(__dirname + "/public/"));

app.use(cookiesParser());



const port = 8080;

app.use("/upload/image", express.static("upload/image"));

app.use("/api", appRoutes)
app.use("/admin", adminRoutes)





server.listen(port,  () => {
    console.log("server started at http://localhost:" +port);
    console.log("server started");
  });


