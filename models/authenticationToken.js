var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authenticationTokenSchema = new Schema({
	userId: { type: String, required: true },
	token: { type: String, unique: true , required: true, index: false},
	active: { type: Boolean, required: true},
	blackListed: { type: Boolean, required: true}
	}	
)

//authenticationTokenSchema.index({userId: 1, token: -1 })

module.exports = mongoose.model('AuthenticationToken', authenticationTokenSchema);