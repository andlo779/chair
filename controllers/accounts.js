var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../_config');
var User = require('../models/user');

var router = express.Router();


router.post('/authenticate', function(req, res, next) {
	User.findOne({ username: req.body.username }, function(err, user) {
      if (err) return next(err);

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // Check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // Create token if the password matched and no error was thrown
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

router.post('/changePassword', passport.authenticate('jwt', { session: false }), function(req, res, next) {

	res.json('Not implemente yet!');
})

router.post('/invalidatetoken', function(req, res, next) {
	//ToDo - Keep invalidated tokens in new DB table + update validation logic to check new DB table
})


router.get('/bajs', function(req, res, next) {
	// if (err) return next(err);
	res.json('Hej');
})

module.exports = router;
