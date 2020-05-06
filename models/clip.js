const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const findOrCreate = require('mongoose-findorcreate');

const ClipSchema = new Schema({
    url: { type: String },
    postTime: { type: String }
});

ClipSchema.index({ postTime: 1 }, { unique: true }); //Defines an index (most likely compound) for this schema
ClipSchema.plugin(uniqueValidator);
ClipSchema.plugin(findOrCreate);

const Clip = mongoose.model('Clip', ClipSchema);
module.exports = Clip;