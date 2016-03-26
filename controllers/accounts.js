var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../_config');
var User = require('../models/user');

var router = express.Router();


router.post('/authenticate', function(req, res, next) {
	User.findOne({ username: req.body.username }, '+password', function(err, user) {
      if (err) return next(err);

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.sign(user, config.jwt.secret, {
              expiresIn: config.jwt.token_ttl
            });
            res.status(200).json({ success: true, token: 'JWT ' + token });
          } else {
            res.status(401).json({ success: false, message: 'Authentication failed. Passwords did not match.' });
          }
        });
      }
    });
});

router.post('/changePassword/:id', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  if(!req.body.password) {
    res.status(400).json({ success: false, message: 'Please enter new password.' });
  } else {
    User.findById(req.params.id, function(err, user) {
      if(err) {
        return next(err);
      }
      if(!user) {
        res.status(400).json({ sucess: false, message: 'User not found for id: ' + req.params.id });
      } else {
        user.password = req.body.password;
        user.save(function(error) {
          if(error) return next(error);
        	res.status(200).json({ sucess: true, message: 'Password have been updated for user: ' + req.params.id });
        })
      }
    })
  }
})

router.post('/invalidatetoken', function(req, res, next) {
	//ToDo - Keep invalidated tokens in new DB table + update validation logic to check new DB table
})


router.get('/bajs', function(req, res, next) {
	// if (err) return next(err);
	res.json('Hej');
})

module.exports = router;
