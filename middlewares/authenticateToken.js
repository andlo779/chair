var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../_config');
var AuthenticationToken = require('../models/authenticationToken');

var authenticateUser = function() {
	return authenticate('user');
}

var authenticateAdmin = function() {
	return authenticate('admin');
}

var authenticate = function(role) {
	return function(req, res, next) {
		var token = req.headers['token'];

		if(!token)
			return res.status(403).send({ success: false, message: 'No token provided.' });

    jwt.verify(token, config.jwt.secret, function(err, decoded) {      
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token 1.' });    
      }
      
			User.findOne(decoded._doc._id, function(err, user) {

				if(err) {
					return next(err);
				}

					if(!user) {
					return res.status(401).json({ success: false, message: 'Failed to authenticate token 2.' });
				}
			
				if(user.role != role && user.role != 'admin') {
					return res.status(401).json({ success: false, message: 'Failed to authenticate token 3.' });
				}

				console.log('userid = ' + user.userid);

				AuthenticationToken.findOne({userId: user.userid}, function(err, authenticationToken) {
					if(err) {
						return next(err);
					}

					if(!authenticationToken) {
						return res.status(401).json({ success: false, message: 'Failed to authenticate token 4.' });
					}

					req.decoded = decoded;    
	      	next();
				})
			});
    });
	};
};

module.exports = {
  roleUser: authenticateUser,
  roleAdmin: authenticateAdmin
}