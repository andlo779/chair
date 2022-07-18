var mongoose = require('mongoose');

var whishListSchema = new mongoose.Schema({
  recordName: { type: String, required: true },
  artist: { String, required: true },
  productionYear: Number,
  addedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('WhishList', whishListSchema);
