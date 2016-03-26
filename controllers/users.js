var express = require('express');
var passport = require('passport');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/user.js');

var router = express.Router();

/* POST one user. */
router.post('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
	if(!req.body.username || !req.body.password) {
    res.status(400).json({ success: false, message: 'Please enter username and password.' });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.status(400).json({ success: false, message: err.message});
      }
      res.status(201).json({ success: true, message: 'Successfully created new user.' });
    });
  }
})

/* GET all users. */
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  User.find(function(err, users) {
  	if (err) return next(err);
  	res.json(users);
  })
});

/* GET single user. */
router.get('/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if (err) return next(err);
		res.json(user);
	})
})

// /* PUT single user. */
// router.put('/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {
//   User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, post) {
// 		if (err) return next(err);
// 		res.json(post);
// 	})
// })

/* DELETE single user. */
router.delete('/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function(err, post) {
  	if (err) return next(err);
  	res.json(post);
  })
})

module.exports = router;