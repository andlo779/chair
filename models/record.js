var mongoose = require('mongoose');

var recordSchema = new mongoose.Schema({
  name: String,
  productionYear: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('record', recordSchema);