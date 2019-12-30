//导入express模块
const express = require("express");
//创建indexRouter路由器对象
const router = express.Router();
//定义/ 路由
router.get("/", (req, res) => {
  res.send("首页/");
})
//导出indexRouter路由器对象
module.exports = router;