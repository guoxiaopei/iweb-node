//引入express模块
const express = require("express");
//引入数据库连接池
const pool = require("../pool");
//创建userRouter对象
const router = express.Router();
//定义注册接口 /user/register
router.post("/register", (req, res) => {
  // console.log(req.body);
  let obj = req.body;
  var pt = /^1[3-9]\d{9}$/;
  if (!pt.test(obj.phone)) {
    res.json({code: 405, msg: "手机号格式非法"})
  }
  let sql = "INSERT INTO user VALUES SET ?";
  //let sql = "INSERT INTO user(uid,uname,phone,upwd) VALUES (NULL, ?, ?, ?)";
  pool.query(sql, [obj], (err, result) => {
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
//定义登录路由 /user/login
router.post("/login", (req, res) => {
  //获取数据
  let obj = req.body;
  //检测用户名是否为空
  if(!obj.uname) {
    res.json({code: 401, msg: "uname required"})
  }
  //检测密码是否为空
  if(!obj.upwd) {
    res.json({code: 402, msg: "upwd required"})
  }
  //sql查询语句
  let sql = "SELECT * FROM user WHERE (uname=? AND upwd=?) OR (phone=? AND upwd=?) LIMIT 1";
  //数据库查询
  pool.query(sql, [obj.uname, obj.upwd, obj.uname, obj.upwd], (err, result) => {
    if(err) throw err;
    //查询结果长度大于0，表示查到相应结果
    if(result.length > 0) {
      res.json({code: 200, msg: "success", data: result[0]})
    } else {
      res.json({code: 301, msg: "error", data: "登录失败"})
    }
  })
})
//检查用户名是否存在
router.post("/check_uname", (req, res) => {
  let obj = req.body;
  if(!obj.uname) {
    res.json({code: 300, msg: "uname is required"});
  }
  // let sql = "SELECT uname FROM user WHERE uname=?";
  let sql = "SELECT count(*) as num FROM user WHERE uname=?";
  pool.query(sql, [obj.uname], (err, result) => {
    if(err) throw err;
    console.log(result);
    if(result[0].num == 0) {
      res.json({code: 200, msg: "not exist"})
    } else {
      res.json({code: 301, msg: "exist"})
    }
  })
})
//检查手机号是否存在
router.post("/check_phone", (req, res) => {
  let obj = req.body;
  if(!obj.phone) {
    res.json({code: 300, msg: "phone is required"})
    return;
  }

  let sql = "SELECT count(*) as num FROM user WHERE phone=?";
  pool.query(sql, [obj.phone], (err, result) => {
    if(err) throw err;
    console.log(result)
    if(result[0].num == 0) {
      res.json({code: 200, msg: "not exist"})
    } else {
      res.json({code: 301, msg: "exist"})
    }
  })
})
//导出userRouter对象
module.exports = router;