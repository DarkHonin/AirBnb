var mongoose = require('mongoose');

var usersSchema = mongoose.Schema ({
  id: {type:String, required: true, unique: true},
  displayName: { type: String,  required: true },
  email: { type: Object,  required: true },
  accountType: {type: Number, default: -1}
});


const User = mongoose.model('User', usersSchema);

module.exports = User

// console.log('This file (user.js) is loaded too!');
