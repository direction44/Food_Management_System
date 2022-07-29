var express = require("express");
var router = express.Router();
var pool = require("./pool");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

/* GET home page. */
router.get("/adminlogin", function (req, res, next) {
  res.render("adminlogin", { message: "" });
});
router.get("/logout", function (req, res, next) {
  localStorage.clear();
  res.render("adminlogin", { message: "" });
});
router.post("/check_admin_login", function (req, res, next) {
  pool.query(
    "select * from admins where (emailid=? or mobileno=?) and password=?",
    [req.body.emailid, req.body.emailid, req.body.password],
    function (error, result) {
      if (error) {
        res.render("adminlogin", { message: "Server Error.." });
      } else {
        if (result.length == 1) {
          localStorage.setItem("ADMIN", JSON.stringify(result[0]));
          res.render("dashboard", { result: result[0] });
        } else {
          res.render("adminlogin", {
            message: "Invalid User Id/Mobile No/Password",
          });
        }
      }
    }
  );
});

module.exports = router;
