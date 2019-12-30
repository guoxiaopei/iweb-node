//引入express模块
const express = require("express");
//引入数据库连接池
const pool = require("../pool");
//创建userRouter对象
const router = express.Router();
//定义注册接口 /user/register
router.post("/register", (req, res) => {
  // console.log(req.body);
  let uname = req.body.uname;
  // console.log(uname);
  let upwd = req.body.upwd;
  // console.log(upwd);
  let phone = req.body.phone;
  let sql = "INSERT INTO user(uid,uname,phone,upwd) VALUES (NULL, ?, ?, ?)";
  pool.query(sql, [uname, phone, upwd], (err, result) => {
    if(err) throw err;
    // console.log(result);
    if(result.affectedRows === 1){
      res.json({
        code: 200,
        msg: "success",
        data: {
          uid: result.insertId,
          uname: uname
        }
      });
    } else {
      res.json({
        code: 400,
        msg: "error",
        data: "注册失败"
      });
    }
    
  });
});
//导出userRouter对象
module.exports = router;