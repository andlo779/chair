var config = {};

config.mongoURI = {
  development: 'mongodb://localhost/chair',
  test: 'mongodb://localhost/test-chair'
};

config.jwt = { 
	secret: 'din mamma vet vad katten kostar',
	token_ttl: 7200
}

module.exports = config;