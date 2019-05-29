var mongoose = require('mongoose');

var usersSchema = mongoose.Schema ({
  email: { type: Object,  required: true },
  displayName: { type: String,  required: true },
  id: {type:String, required: true, unique: true}
});

const User = mongoose.model('User', usersSchema);

module.exports = User

// console.log('This file (user.js) is loaded too!');
