const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.listen(5050);
console.log("Server is listening 5050, runing......");

app.use(bodyParser.urlencoded({extended: false}));
app.get("/hello", (req, res) => {
  res.send("hello world!");
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