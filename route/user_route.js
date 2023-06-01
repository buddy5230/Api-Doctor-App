//let mongoose = require("mongoose");
let express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");
//const secretKey = "nothing";
let userSchema = require("../models/user");
const bcrypt = require("bcrypt");

router.route("/").get((req, res, next) => {
  userSchema
    .find()
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      return next(error);
    });
});
// get ข้อมูล user เดียว
router.route("/:id").get((req, res, next) => {
  userSchema
    .findById(req.params.id)
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      return next(error);
    });
});
// สมัครสมาชิค
router.route("/register").post((req, res, next) => {
  userSchema
    .findOne({ id: req.body.id })
    .then((user) => {
      console.log("user+1"+user)
      if (user) {
        res.status(409).json({ message: "ยูสเซอร์เนมนี้มีอยู่เเล้วในระบบ" });
      } else {
        userSchema
          .findOne({ email: req.body.email })
          .then((user) => {
            if (user) {
              res.status(409).json({ message: "อีเมล์นี้มีอยู่เเล้วในระบบ" });
            }  else {
              // เข้ารหัสลับรหัสผ่านก่อนบันทึกลงในฐานข้อมูล
              bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                  return next(err);
                }
                // ตั้งค่ารหัสผ่านที่เข้ารหัสลับใหม่
                req.body.password = hashedPassword;
                
                userSchema
                  .create(req.body)
                  .then((data) => {
                    console.log(data);
                    res.json(data);
                  })
                  .catch((error) => {
                    return next(error);
                  });
              });
            }
          })
          .catch((error) => {
            return next(error);
          });
      }
    })
    .catch((error) => {
      return next(error);
    });
});
//เข้าสู่ระบบ
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  userSchema
    .findOne({ id: username })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error(err);
            res.send({ message: "การเข้าสู่ระบบล้มเหลว" });
          } else if (result) {
            //const token = jwt.sign({ userId: user._id }, secretKey);
            //console.log("token"+token)
            res.send({ message: "เข้าสู่ระบบสำเร็จ", userId: user._id});
          } else {
            res.send({ message: "เข้าสู่ระบบล้มเหลว" });
          }
        });
      } else {
        res.send({ message: "ยังไม่ได้สมัครสมาชิก" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: "การเข้าสู่ระบบล้มเหลว" });
    });
});

// อัปเดต
router.route("/update/:id").put((req, res, next) => {
  userSchema
    .findByIdAndUpdate(req.params.id, {
      $set: req.body,
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      return next(error);
    });
});

module.exports = router;
