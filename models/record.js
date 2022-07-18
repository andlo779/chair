var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recordSchema = new Schema({
  artist: String,
  recordName: { type: String, required: true },
  productionYear: Number,
  printYear: Number,
  recordLable: String,
  condition: {type: Schema.Types.ObjectId, ref: 'Condition'},
  rating: Number,
  // addedBy: { type: Schema.Types.ObjectId , ref: 'User'},
  updated_at: { type: Date, default: Date.now }
});

var conditionSchema = new mongoose.Schema({
	record: { type: String, enum: ['poor', 'good', 'excelent']},
	cover: { type: String, enum: ['poor', 'good', 'excelent']}
})

module.exports = mongoose.model('Record', recordSchema);
module.exports = mongoose.model('Condition', conditionSchema);