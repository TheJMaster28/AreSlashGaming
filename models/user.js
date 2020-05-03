const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema({
    username: { type: String },
    googleId: { type: String },
    googleProfile: { type: Object },
    googleAccessToken: { type: String }
});

UserSchema.index({ username: 1, googleId: 1 }, { unique: true }); //Defines an index (most likely compound) for this schema
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);
module.exports = User;
