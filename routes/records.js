var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var record = require('../models/record.js');

/* POST one record. */
router.post('/', function(req, res, next) {
	record.create(req.body, function(err, post) {
		if (err) return next(err);
		res.json(post);
	})
})

/* GET all records. */
router.get('/', function(req, res, next) {
  record.find(function(err, records) {
  	if (err) return next(err);
  	res.json(records);
  })
});

/* GET one record. */
router.get('/:id', function(req, res, next) {
	record.findById(req.params.id, function(err, record) {
		if (err) return next(err);
		res.json(record);
	})
})

/* PUT one record. */
router.put('/:id', function(req, res, next) {
  record.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
		if (err) return next(err);
		res.json(post);
	})
})

/* DELETE one record. */
router.delete('/:id', function(req, res, next) {
  record.findByIdAndRemove(req.params.id, req.body, function(err, post) {
  	if (err) return next(err);
  	res.json(post);
  })
})

module.exports = router;
