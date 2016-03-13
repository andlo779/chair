var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var record = require('../models/record.js');

/* GET all records. */
router.get('/', function(req, res, next) {
  record.find(function(err, records) {
  	if (err) return next(err);
  	res.json(records);
  }
  	)
});

module.exports = router;
