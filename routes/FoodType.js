var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.get("/fetch_all_foodtype", function (req, res, next) {
  pool.query("select * from foodtype", function (error, result) {
    if(error)
    {
      res.status(500).json({status:False})
    }
    else
    {
     res.status(200).json({status:true,result:result})
  
    }
  });
});
router.get("/fetch_all_food", function (req, res, next) {
  pool.query(
    "select * from food where FoodTypeid=?",
    [req.query.FoodTypeid],
    function (error, result) {
      if (error) {
        res.status(500).json({
          status: false,
        });
      } else {
        res.status(200).json({ status: true, result: result });
      }
    }
  );
});
module.exports = router;
