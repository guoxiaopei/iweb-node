//引入express模块
const express = require("express");
//引入数据库连接池
const pool = require("../pool");
//创建路由器对象
const router = express.Router();

//课程分类路由
router.get("/", (req, res) => {
  let sql = "SELECT * FROM type";
  pool.query(sql, (err, result) => {
    if(err) throw err;
    if(result) {
      res.json({code: 200, msg: "success", data: result})
    }
  })
})
//导出路由对象
module.exports = router;