process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('../_config');

var server = require('../app');
var User = require('../models/user');
var password = 'password';
var token = null;
var should = chai.should();
chai.use(chaiHttp);

describe('Users', function() {
	User.collection.drop();

	beforeEach(function(done) {
    var newuser = new User({
      username: 'testuser',
      password: password
    });
    newuser.save(function(err) {
      token = 'JWT ' + jwt.sign(newuser, config.jwt.secret, {
        expiresIn: config.jwt.token_ttl
      });
      done();
    });
  });

  afterEach(function(done){
    User.collection.drop();
    done();
  });

  it('should list ALL users on /users GET', function(done) {
	  chai.request(server)
	    .get('/users')
      .set('Authorization', token)
	    .end(function(err, res){
	      res.should.have.status(200);
	      res.should.be.json;
	      res.body.should.be.a('array');
	      res.body[0].should.have.property('_id');
     	  res.body[0].should.have.property('username');
      	res.body[0].username.should.equal('testuser');
        res.body[0].should.have.property('role');
        res.body[0].role.should.equal('user');
      	res.body[0].should.not.have.property('password');
	      done();
	    });
	});

  it('should list a SINGLE user on /users/<id> GET', function(done) {
    var username = 'testGetSingle';
    var singleuser = new User({ 
      username: username,
      password: password
    });
    singleuser.save(function(err, data) {
      chai.request(server)
        .get('/users/'+data.id)
        .set('Authorization', token)
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('username');
          res.body.username.should.equal(username);
          res.body.should.have.property('role');
          res.body.role.should.equal('user');
          res.body.should.not.have.property('password');
          res.body._id.should.equal(data.id);
          done();
        });
    });
	});

  it('should add a SINGLE user on /users POST', function(done) {
    var username = 'testuserNew';
	  chai.request(server)
	    .post('/users')
      .set('Authorization', token)
	    .send({ 'username': username, 'password': password })
	    .end(function(err, res){
	      res.should.have.status(201);
	      res.should.be.json;
	      res.body.should.be.a('object');
	      // res.body.should.have.property('_id');
        // res.body.should.have.property('username');
        // res.body.username.should.equal(username);
        // res.body.should.not.have.property('salt');
        // res.body.should.not.have.property('hash');
	      done();
	    });
	});

  it('should NOT add a DUPLICATED user on /users POST', function(done) {
    var username = 'testBAJSSingle';
    var singleuser = new User({ 
      username: username,
      password: password
    });
    singleuser.save(function(err, data) {
      chai.request(server)
        .post('/users')
        .set('Authorization', token)
        .send({ 'username': username, 'password': password })
        .end(function(err, res){
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          // res.body.should.have.property('error');
          done();
        });
    });
  });

  // it('should update a SINGLE user on /users/<id> PUT', function(done) {
  // chai.request(server)
  //   .get('/users')
  //   .end(function(err, res){
  //     chai.request(server)
  //       .put('/users/'+res.body[0]._id)
  //       .send({'name': 'updatedName'})
  //       .end(function(error, response){
  //         response.should.have.status(200);
  //         response.should.be.json;
  //         response.body.should.be.a('object');
  //         response.body.should.have.property('_id');
  //         response.body.should.have.property('username');
  //         response.body.username.should.equal('testuser');
  //         res.body.should.not.have.property('salt');
  //         res.body.should.have.not.property('hash');
  //         done();
  //     });
  //   });
  // });

  it('should delete a SINGLE user on /users/<id> DELETE', function(done) {
  chai.request(server)
    .get('/users')
    .set('Authorization', token)
    .end(function(err, res){
      chai.request(server)
        .delete('/users/'+res.body[0]._id)
        .set('Authorization', token)
        .end(function(error, response){
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('_id');
          response.body.should.have.property('username');
          response.body.username.should.equal('testuser');
          done();
      });
    });
	});
});