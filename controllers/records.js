var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var record = require('../models/record.js');
var authorization = require('../middlewares/authenticate');

/* POST one record. */
router.post('/', authorization.roleAdmin(), function(req, res, next) {
	record.create(req.body, function(err, post) {
		if (err) return next(err);
		res.json(post);
	})
})

/* GET all records. */
router.get('/', authorization.roleUser(), function(req, res, next) {
  record.find(function(err, records) {
  	if (err) return next(err);
  	res.json(records);
  })
});

/* GET single record. */
router.get('/:id', authorization.roleUser(), function(req, res, next) {
	record.findById(req.params.id, function(err, record) {
		if (err) return next(err);
		res.json(record);
	})
})

/* PUT single record. */
router.put('/:id', authorization.roleUser(), function(req, res, next) {
  record.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, post) {
		if (err) return next(err);
		res.json(post);
	})
})

/* DELETE single record. */
router.delete('/:id', authorization.roleAdmin(), function(req, res, next) {
  record.findByIdAndRemove(req.params.id, req.body, function(err, post) {
  	if (err) return next(err);
  	res.json(post);
  })
})

module.exports = router;
