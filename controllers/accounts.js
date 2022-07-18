var express = require('express');
var jwt = require('jsonwebtoken');
var authorization = require('../middlewares/authenticateToken');
var config = require('../_config');
var User = require('../models/user');
var AuthenticationToken = require('../models/authenticationToken');

var router = express.Router();

//ToDo: Move authentication logic to authentication middleware in function below
router.post('/authenticate', function(req, res, next) {
	User.findOne({ username: req.body.username }, '+password', function(err, user) {
      if (err) {
        console.log('kiss');
        return next(err);
      }

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            user.password = undefined;
            var token = jwt.sign(user, config.jwt.secret, {
              expiresIn: config.jwt.token_ttl
            });

            AuthenticationToken({userId: user.userid, token: token, active: true, blackListed: false}).save(function(error) {
              if(error) {
                console.error("userId: " + user.userid);
                console.error("token: " + token);
                console.error("Hej kanin");
                console.error(error);
                //return next(err);
                return res.status(500).json({ success: false, message: error });
              }

              res.status(200).json({ success: true, token: token });

            })
          } else {
            res.status(401).json({ success: false, message: 'Authentication failed. Passwords did not match.' });
          }
        });
      }
    });
});

router.post('/changePassword/:id', authorization.roleUser(), function(req, res, next) {
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
  var token = req.headers['token'];
  if(!token) {
    res.status(400).json({ success: false, message: 'Missing token.' });
  } else {
    AuthenticationToken.remove({ tokenId: token.tokenId }, function(err) {
      if(err) {
        return next(err);
      }
      res.status(204).json({ sucess: true, message: 'Token sucessfully deleted.'});
    })
  }

})

module.exports = router;
