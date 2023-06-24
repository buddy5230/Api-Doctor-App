const express = require('express');
const userSchemaVac = require('../models/vaccine');
const router = express();

router.route('/his').get((req, res, next) => {
  userSchemaVac
    .find()
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      //return next(error);
    });
});

router.route('/update/:id').put((req, res, next) => {
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

router.route('/delete/:id/:id').delete((req, res, next) => {
  userSchemaVac
    .findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
      }
      res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
    })
    .catch((error) => {
      return next(error);
    });
});

module.exports = router;
