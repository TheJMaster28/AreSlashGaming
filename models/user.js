const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const findOrCreate = require('mongoose-findorcreate');

/*
* google profile authentication will return a JSON object
* containing basic google info display name, profile picture, associated emails, etc.
*/
const UserSchema = new Schema({
    username: { type: String },
    googleId: { type: String },
    googleProfile: { type: Object }, 
    googleAccessToken: { type: String }
});

/*
* Defines an index (most likely compound) for UserSchema 
* 1 = ascending
* -1 = descending
*/
UserSchema.index({ username: 1, googleId: 1 }, { unique: true }); 
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);
module.exports = User;
