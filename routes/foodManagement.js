var express = require("express");
var router = express.Router();
var pool = require("./pool");
const upload = require("./multer");
var fs = require("fs");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

router.get("/FoodManagement", function (req, res, next) {
  try {
    var admin = JSON.parse(localStorage.getItem("ADMIN"));
    if (admin == null) {
      res.render("adminlogin", { message: "" });
    }
    res.render("FoodInterface", { status: null });
  } catch (e) {
    res.render("adminlogin", { message: "" });
  }
});
router.post(
  "/Submit_Record",
  upload.single("picture"),
  function (req, res, next) {
    pool.query(
      "insert into fooddetails(FoodTypeid, Foodid, Discription, Price, Offerprice, Type, Status, Picture) values(?,?,?,?,?,?,?,?)",
      [
        req.body.foodtype,
        req.body.food,
        req.body.discription,
        req.body.price,
        req.body.offerprice,
        req.body.type,
        req.body.status,
        req.file.filename,
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.render("FoodInterface", { status: 0 });
        } else {
          console.log(result);
          res.render("FoodInterface", { status: 1 });
        }
      }
    );
  }
);
router.get("/Display_All_Food", function (req, res, next) {
  try {
    var admin = JSON.parse(localStorage.getItem("ADMIN"));
    if (admin == null) {
      res.render("adminlogin", { message: "" });
    }

    pool.query(
      "select F.*,(select S.FoodTypename from foodtype S where S.FoodTypeid=F.FoodTypeid) as foodtype,(select C.FoodName from food C where C.Foodid=F.Foodid) as food from fooddetails F",
      function (error, result) {
        if (error) {
          res.render("displaysfood", { result: result });
        } else {
          res.render("displaysfood", { result: result });
        }
      }
    );
  } catch (e) {
    res.render("adminlogin", { message: "" });
  }
});
router.get("/Display_by_id", function (req, res, next) {
  pool.query(
    "select F.*,(select S.FoodTypename from foodtype S where S.FoodTypeid=F.FoodTypeid) as foodtype,(select C.FoodName from food C where C.Foodid=F.Foodid) as food from fooddetails F where F.FoodDetailsid=?",
    [req.query.fid],
    function (error, result) {
      if (error) {
        res.render("displaybyid", { result: [] });
      } else {
        res.render("displaybyid", { result: result[0] });
      }
    }
  );
});
router.post(
  "/edit_food_management",

  function (req, res, next) {
    if (req.body.action == "Edit") {
      pool.query(
        "update fooddetails set FoodTypeid=? , Foodid=?, Discription=?, Price=?, Offerprice=?, Type=?, Status=? where FoodDetailsid=?",
        [
          req.body.foodtype,
          req.body.food,
          req.body.discription,
          req.body.price,
          req.body.offerprice,
          req.body.type,
          req.body.status,
          req.body.FoodDetailsid,
        ],
        function (error, result) {
          if (error) {
            console.log(error);
            res.redirect("/Food/Display_All_Food");
          } else {
            console.log(result);
            res.redirect("/Food/Display_All_Food");
          }
        }
      );
    } else {
      pool.query(
        "delete from fooddetails where FoodDetailsid=?",
        [req.body.FoodDetailsid],
        function (error, result) {
          if (error) {
            console.log(error);
            res.redirect("/Food/Display_All_Food");
          } else {
            console.log(result);
            res.redirect("/Food/Display_All_Food");
          }
        }
      );
    }
  }
);
router.post(
  "/edit_food_picture",
  upload.single("picture"),
  function (req, res, next) {
    pool.query(
      "update fooddetails set Picture=? where FoodDetailsid=?",
      [req.file.filename, req.body.fooddetailsid],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/Food/Display_All_Food");
        } else {
          console.log(result);
          var filePath =
            "D:/FoodManagement/public/images/" + req.body.oldpicture;
          fs.unlinkSync(filePath);

          res.redirect("/Food/Display_All_Food");
        }
      }
    );
  }
);
router.get("/Display_Picture", function (req, res, next) {
  res.render("displaypicture", {
    fooddetailsid: req.query.fooddetailsid,
    foodtype: req.query.foodtype,
    food: req.query.food,
    picture: req.query.picture,
  });
});

module.exports = router;
