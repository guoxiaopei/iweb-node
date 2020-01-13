//导入express模块
const express = require("express");
//导入pool连接池
const pool = require("../pool");
//创建orderRouter路由器对象
const router = express.Router();
//定义添加订单路由 /order/add
router.post("/add", (req, res) => {
  var obj = req.body;
  console.log(obj)
  if(!obj.uid) {
    res.json({code: 401})
    return;
  }
  if(!obj.orderAmount) {
    res.json({code: 402})
    return;
  }
  if(!obj.selected) {
    res.json({code: 403})
    return;
  }
  var created = parseInt(new Date().getTime/1000);
  var order = {
    userId: obj.uid,
    amount: obj.orderAmount,
    created: created
  }
  let sql = "INSERT INTO order SET ?";
  pool.query(sql, [order], (err, result) => {
    if(err) throw err;
    if(result.affectedRows > 0) {
      //添加订单表成功（oid）
      var orderId = result.insertId;
      let sql = "INSERT INTO orders_detail(orderId,courseId,count) VALUES ?";
      var details = [];
      for (var i=0; i<obj.selected.length; i++) {
        var tmp = [];
        tmp.push(orderId);
        tmp.push(obj.selected[i].courseId);
        tmp.push(obj.selected[i].count);
        details.push(tmp);
      }
      pool.query(sql, [details], (err, result) => {
        if(err) throw err;
        if(result.affectedRows > 0) {
          res.json({code: 200, msg: 'success', data: {orderId: orderId}})
        }
      })
    } else {
      res.json({code: 301,msg: 'failed'});
    }
  })
})
//用户订单列表路由
router.post("/list", (req, res) => {
  var obj = req.body;
  if(!obj.userId) {
    res.json({code: 401, msg: 'userId is required'});
    return;
  }
  let sql = "SELECT * FROM orders,orders_detail,course WHERE orders.oid=orders_detail.orderId AND orders_detail.courseId=course.cid AND orders.userId=? ORDER BY orders.created DESC";
  pool.query(sql, [obj.userId], (err, result) => {
    if(err) throw err;
    if(result.length > 0) {
      res.json({code: 200, msg: 'success', data: result})
    } else {
      res.json({code: 300, msg: 'empty'})
    }
  })
})
//导出orderRouter路由器对象
module.exports = router;