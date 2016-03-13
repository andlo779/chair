process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var server = require('../app');
var Record = require('../models/record');

var should = chai.should();
chai.use(chaiHttp);

describe('Records', function() {

	Record.collection.drop();

	beforeEach(function(done){
    var newRecord = new Record({
      name: 'testRecord',
      productionYear: 1981
    });
    newRecord.save(function(err) {
      done();
    });
  });
  afterEach(function(done){
    Record.collection.drop();
    done();
  });

  it('should list ALL records on /records GET', function(done) {
	  chai.request(server)
	    .get('/records')
	    .end(function(err, res){
	      res.should.have.status(200);
	      res.should.be.json;
	      res.body.should.be.a('array');
	      res.body[0].should.have.property('_id');
     	  res.body[0].should.have.property('name');
      	res.body[0].name.should.equal('testRecord');
      	res.body[0].should.have.property('productionYear');
      	res.body[0].productionYear.should.equal(1981);
	      done();
	    });
	});

  it('should list a SINGLE record on /records/<id> GET', function(done) {
    var testRecord = new Record({
      name: 'testGetSingle',
      productionYear: '1984'
    });
    testRecord.save(function(err, data) {
      chai.request(server)
        .get('/records/'+data.id)
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.name.should.equal('testGetSingle');
          res.body.should.have.property('productionYear');
          res.body.productionYear.should.equal(1984);
          res.body._id.should.equal(data.id);
          done();
        });
    });
	});

  it('should add a SINGLE record on /records POST', function(done) {
	  chai.request(server)
	    .post('/records')
	    .send({ 'name': 'testRecord', 'productionYear': 1982 })
	    .end(function(err, res){
	      res.should.have.status(200);
	      res.should.be.json;
	      res.body.should.be.a('object');
	      res.body.should.have.property('_id');
	      res.body.should.have.property('name');
	      res.body.name.should.equal('testRecord');
	      res.body.should.have.property('productionYear');
	      res.body.productionYear.should.equal(1982);
	      done();
	    });
	});

  it('should update a SINGLE record on /records/<id> PUT', function(done) {
  chai.request(server)
    .get('/records')
    .end(function(err, res){
      chai.request(server)
        .put('/records/'+res.body[0]._id)
        .send({'name': 'updatedName'})
        .end(function(error, response){
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('_id');
          response.body.should.have.property('name');
          response.body.name.should.equal('updatedName');
          response.body.should.have.property('productionYear');
          response.body.productionYear.should.equal(1981);
          done();
      });
    });
});

  it('should delete a SINGLE record on /records/<id> DELETE', function(done) {
  chai.request(server)
    .get('/records')
    .end(function(err, res){
      chai.request(server)
        .delete('/records/'+res.body[0]._id)
        .end(function(error, response){
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('_id');
          response.body.should.have.property('name');
          response.body.name.should.equal('testRecord');
          done();
      });
    });
	});
});