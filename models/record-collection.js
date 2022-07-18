var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recordCollectionSchema = new Schema({
user: {type: Schema.Types.ObjectId, ref: 'User'},
records: [{type: Schema.Types.ObjectId, ref: 'Record'}]
});

module.exports = mongoose.model('RecordCollection', recordCollectionSchema);