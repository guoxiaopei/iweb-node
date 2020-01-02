//引入express模块
const express = require("express");
//引入数据库连接池
const pool = require("../pool");
//创建路由器对象
const router = express.Router();

//课程列表路由
router.get("/list", (req, res) => {

  let curPage = parseInt(req.query.curPage) || 1;
  let pageSize = parseInt(req.query.pageSize) || 3;
  let typeId = parseInt(req.query.typeId) || 0;
  let offset = (curPage-1)*pageSize;
  console.log(typeId);
  let sql,limitsql;
  if(typeId == 0) {
    sql = "SELECT count(1) as num FROM course";
    limitsql = "SELECT * FROM course,teacher WHERE course.teacherId = teacher.tid LIMIT ?,?";
  } else {
    sql = "SELECT count(1) as num FROM course WHERE typeId=" + typeId;
    limitsql = "SELECT * FROM course,teacher WHERE course.teacherId = teacher.tid AND typeId=" + typeId + " LIMIT ?,?";
  }
  pool.query(sql, (err, result) => {
    if(err) throw err;
    let total = result[0].num;
    let pageTotal = Math.ceil(total/pageSize);
    
    pool.query(limitsql, [offset, pageSize], (err, result) => {
      if(err) throw err;

      res.json({
        code: 200,
        msg: "success",
        data: {
          list: result,
          total: total,
          pageSize: pageSize,
          curPage: curPage,
          pageTotal: pageTotal
        }
      });
    })
  })
})
//课程详情路由
router.get("/detail", (req, res) => {
  let cid = parseInt(req.query.cid);
  if(!cid) {
    res.json({code: 300, msg: "cid is required"});
    return;
  }
  console.log(cid, typeof cid);
  let sql = "SELECT * FROM course,teacher WHERE course.teacherId = teacher.tid AND cid=?";
  pool.query(sql, [cid], (err, result) => {
    if(err) throw err;
    res.json({
      code: 200,
      msg: "success",
      data: result[0]
    })
  })
})
//获取最新课程
router.get("/newest", (req, res) => {
  let countNum = req.query.countNum;
  if(!countNum) {
    countNum = 4;
  }
  let sql = "SELECT cid,pic,price,title,tname FROM course,teacher WHERE course.teacherId = teacher.tid ORDER BY cid DESC LIMIT ?";
  pool.query(sql, [parseInt(countNum)], (err, result) => {
    if(err) throw err;
    console.log(result);
    res.json({
      code: 200,
      msg: "success",
      data: result
    })
  })
})
//导出路由对象
module.exports = router;