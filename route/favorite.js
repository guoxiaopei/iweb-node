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
      res.json({code: 200, msg: "success"})
    } else {
      res.json({code: 300, msg: "failed"})
    }
  })
})
module.exports = router;