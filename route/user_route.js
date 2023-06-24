const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = require("../models/user");
const userSchemaVac = require("../models/vaccine");

const secretKey = "nothing";
const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "ไม่พบ Token" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("เข้าเเล้ว", decoded);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};

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

router.route("/register").post((req, res, next) => {
  console.log("req.body.username ", req.body.username);
  userSchema
    .findOne({ username: req.body.username })
    .then((user) => {
      console.log("user+1" + user);
      if (user) {
        res.status(409).json({ message: "ยูสเซอร์เนมนี้มีอยู่เเล้วในระบบ" });
      } else {
        userSchema
          .findOne({ email: req.body.email })
          .then((user) => {
            if (user) {
              res.status(409).json({ message: "อีเมล์นี้มีอยู่เเล้วในระบบ" });
            } else {
              bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                  return next(err);
                }
                req.body.password = hashedPassword;

                userSchema
                  .create(req.body)
                  .then((data) => {
                    console.log(data);
                    res.json(data);
                  })
                  .catch((error) => {
                    res.send({ message: "การเข้าสู่ระบบล้มเหลว" });
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

router.route("/login").post((req, res, next) => {
  const { username, password } = req.body;
  userSchema
    .findOne({ username: username })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error(err);
            res.send({ message: "การเข้าสู่ระบบล้มเหลว" });
          } else if (result) {
            const token = jwt.sign({ userId: user._id }, secretKey);
            const role = user.role;
            res.send({
              message: "เข้าสู่ระบบสำเร็จ",
              userId: user._id,
              jwtToken: token,
              role: role,
            });
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

router.route("/assess/:id/:id").put(verifyToken, (req, res, next) => {
  userSchemaVac
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

router.route("/booking/:id").post(verifyToken, (req, res, next) => {
  const userId = req.params.id;

  const newBookingData = {
    ...req.body,
    iduser: userId,
  };

  userSchemaVac
    .create(newBookingData)
    .then((createdBooking) => {
      console.log("createdBooking._id", createdBooking._id);
      res.send({ vacId: createdBooking._id });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    });
});

router.route("/historyvac/:id").get((req, res, next) => {
  const userId = req.params.id;
  userSchemaVac
    .find({ iduser: userId })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      return next(error);
    });
});

router.route("/historyvac/:id/:id").get((req, res, next) => {
  userSchemaVac
    .findById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      return next(error);
    });
});

module.exports = router;
