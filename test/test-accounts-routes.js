process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('../_config');

var server = require('../app');
var User = require('../models/user');

var token = null;
var should = chai.should();
chai.use(chaiHttp);

describe('Accounts', function() {

	User.collection.drop();
	var username = 'testuser';
	var password = 'password';

	beforeEach(function(done) {
    var newuser = new User({
      username: username,
      password: password
    });
    newuser.save(function(err) {
      token = jwt.sign(newuser, config.jwt.secret, {
        expiresIn: config.jwt.token_ttl
      });
      done();
    });
  });

  afterEach(function(done){
    User.collection.drop();
    done();
  });

	it('should authenticate ONE users on /accounts/authenticate GET', function(done) {
 		chai.request(server)
 			.post('/accounts/authenticate')
 			.send({ 'username': username, 'password': password })
 			.end(function(err, res){
 				res.should.have.status(200);
	      res.should.be.json;
	      res.body.should.be.a('object');
	      done();
 		})
	});

	it('should UPDATE password for given user on /accounts/changepassword/:id', function(done) {
		var newuser = new User({
			username: 'newUser',
			password: 'testPassword'
		});
		newuser.save(function(err, user) {
			chai.request(server)
				.post('/accounts/changepassword/' + user.id)
				.set('Authorization', token)
				.send({ 'password': 'newpassword' })
				.end(function(err, res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					done();
				});
		});
	});

});