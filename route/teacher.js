//引入expre模块
const express = require("express");
//引入数据库连接池
const pool = require("../pool");
//创建teacher路由器对象
const router = express.Router();

//定义/teacher/list路由
router.get("/list", (req, res) => {
  let sql = "SELECT * FROM teacher";
  pool.query(sql, (err, result) => {
    if(err) throw err;
    res.json({code: 200, msg: "success", data: result});
    // res.send(result);
  })
});

//导出teacher路由器对象
module.exports = router;