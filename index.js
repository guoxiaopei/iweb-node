const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.listen(5050);
console.log("Server is listening 5050, runing......");

app.use(bodyParser.urlencoded({extended: false}));

// 声明跨域
app.all("*",function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin","*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
      res.send(200);  //让options尝试请求快速结束
  else
      next();
});

const indexRouter = require("./route/index");
app.use("/", indexRouter);
const teacherRouter = require("./route/teacher");
app.use("/teacher", teacherRouter);
const userRouter = require("./route/user");
app.use("/user", userRouter);
const typeRouter = require("./route/type");
app.use("/type", typeRouter);
const courseRouter = require("./route/course");
app.use("/course", courseRouter);
const cartRouter = require("./route/cart");
app.use("/cart", cartRouter);
const favoriteRouter = require("./route/favorite");
app.use("/favorite", favoriteRouter);