var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');

var UserSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true, select: false },
  userid: { type: String, default: uuid.v4() },
	role: { type: String, enum: ['user', 'admin'] , default: 'user' }
});

UserSchema.pre('save', function(next) {
  var user = this;
  console.log("USER: " + user);
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);