var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../_config');

var authenticateUser = function() {
	return authenticate('user');
}

var authenticateAdmin = function() {
	return authenticate('admin');
}

var authenticateUserOrAdmin = function() {
	return function(req, res, next) {
		var token = req.body.token || req.headers['x-access-token'] || req.headers['authorization'];
		if (token) {
	    jwt.verify(token, config.jwt.secret, function(err, decoded) {      
	      if (err) {
	      	console.error(err);
	        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
					User.findOne(decoded._doc._id, function(err, user) {
						if (err || !user) {
							return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
						} else {
							if(user.role === role || user. role === 'admin') {
								console.log(user);
		        		req.decoded = decoded;    
		        		next();
							} else {
								return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
							}
						}
					});
	      }
	    });
	  } else {
	    return res.status(403).send({ success: false, message: 'No token provided.' });
	  }
	};
};

var authenticate = function(role) {
	return function(req, res, next) {
		var token = req.body.token || req.headers['x-access-token'] || req.headers['authorization'];
		if (token) {
	    jwt.verify(token, config.jwt.secret, function(err, decoded) {      
	      if (err) {
	      	console.error(err);
	        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	      	// console.log(decoded._doc._id);
					User.findOne(decoded._doc._id, function(err, user) {
						if (err || !user) {
							return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
						} else {
							if(user.role === role || user. role === 'admin') {
		        		req.decoded = decoded;    
		        		next();
							} else {
								return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
							}
						}
					});
	      }
	    });
	  } else {
	    return res.status(403).send({ success: false, message: 'No token provided.' });
	  }
	};
};

module.exports = {
  roleUser: authenticateUser,
  roleAdmin: authenticateAdmin
}