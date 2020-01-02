const express = require("express");
const pool = require("../pool");
const router = express.Router();
//添加购物车接口
router.post("/add", (req, res) => {
  console.log(req.headers["user-agent"]);
  let obj = req.body;
  if(!obj.userId) {
    res.json({code: 301, msg: "userId is required"})
    return;
  }
  if(!obj.courseId) {
    res.json({code: 301, msg: "courseId is required"})
    return;
  }
  if(!obj.count) {
    obj.count = 1;
  }
  // console.log(obj);
  let sql = "SELECT count(*) as num FROM cart WHERE userId=? AND courseId=?";
  pool.query(sql, [obj.userId, obj.courseId], (err, result) => {
    if(err) throw err;
    if(result[0].num > 0) {
      var sql = `UPDATE cart SET count=count+${obj.count} WHERE userId=${obj.userId} AND courseId=${obj.courseId}`;
    } else {
      var sql = `INSERT INTO cart VALUES(NULL, ${obj.userId},  ${obj.courseId}, ${obj.count})`;
    }
    pool.query(sql, (err, result) => {
      if(err) throw err;
      // console.log(result);
      if(result.affectedRows > 0) {
        res.json({code: 200, msg: "success"});
      } else {
        res.json({code: 400, msg: "failed"});
      }
    })
  })
})
//查看购物车列表
router.post("/list", (req, res) => {
  let obj = req.body;
  let sql = "SELECT ctid,courseId,count,title,pic,price FROM cart,course WHERE cart.courseId=course.cid AND cart.userId = ?";
  pool.query(sql, [obj.uid], (err, result) => {
    if(err) throw err;
    console.log(result);
    if(result.length > 0) {
      res.json({code: 200, msg: "success", data: result})
    } else {
      res.json({code: 201, msg: "cart is empty"})
    }
  })
})
//更新购物车
router.post("/update", (req, res) => {
  let obj = req.body;
  if(!obj.count) {
    res.json({code: 301, msg: "count is required"})
    return;
  }
  if(!obj.ctid) {
    res.json({code: 302, msg: "ctid is required"})
    return;
  }
  let sql = "UPDATE cart SET count = ? WHERE ctid = ?";
  pool.query(sql, [obj.count, obj.ctid], (err, result) => {
    if(err) throw err;
    console.log(result);
    if(result.affectedRows > 0) {
      res.json({code: 200, msg: "success"})
    } else {
      res.json({code: 301, msg: "failed"})
    }
  })
})
//清空购物车
router.post("/empty", (req, res) => {
  let obj = req.body;
  if(!obj.uid) {
    res.json({code: 401, msg: "uid is required"});
    return;
  }

  let sql = "DELETE FROM cart WHERE userId = ?";
  pool.query(sql, [obj.uid], (err, result) => {
    if(err) throw err;
    console.log(result);
    if(result.affectedRows > 0) {
      res.json({code: 200, msg: "success"})
    } else {
      res.json({code: 301, msg: "failed"})
    }
  })
})
//删除购物车单个商品
router.post("/delete", (req, res) => {
  let obj = req.body;
  if(!obj.ctid) {
    res.json({code: 401, msg: "ctid is required"});
    return;
  }

  let sql = "DELETE FROM cart WHERE ctid = ?";
  pool.query(sql, [obj.ctid], (err, result) => {
    if(err) throw err;
    console.log(result);
    if(result.affectedRows > 0) {
      res.json({code: 200, msg: "success"})
    }
  })
})
module.exports = router;