const express = require("express");
const pool = require("../pool");
const router = express.Router();
//添加收藏
router.post("/add", (req, res) => {
  let obj = req.body;
  console.log(obj);
  if(!obj.uid) {
    res.json({code: 401, msg: "uid is required"});
  }
  if(!obj.cid) {
    res.json({code: 402, msg: "cid is required"});
  }
  if(!obj.time) {
    obj.time = Math.ceil(new Date().getTime()/1000);
    console.log(obj.time)
  }

  let sql = "INSERT INTO favorite VALUES(NULL, ?, ?, ?)";
  pool.query(sql, [obj.uid, obj.cid, obj.time], (err, result) => {
    if(err) throw err;
    console.log(result);
    if(result.affectedRows > 0) {
      res.json({code: 200, msg: "success", data: {fid: result.insertId}})
    } else {
      res.json({code: 301, msg: "failed"})
    }
  })
})
//收藏查询
router.post("/list", (req, res) => {
  let obj = req.body;
  if(!obj.uid) {
    res.json({code: 301, msg: "uid is required"})
    return;
  }

  let sql = "SELECT course.cid,course.title,course.pic,course.price,favorite.fid,favorite.fTime FROM favorite,course WHERE course.cid = favorite.courseId AND favorite.userId = ? ORDER BY favorite.fTime DESC";
  pool.query(sql, [obj.uid], (err, result) => {
    if(err) throw err;
    console.log(result);
    if(result.length > 0) {
      res.json({code: 200, msg: "success", data: result})
    } else {
      res.json({code: 201, msg: "no favorite"})
    }
  })
})
module.exports = router;