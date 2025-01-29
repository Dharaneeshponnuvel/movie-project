const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type :String},
    email: { type :String},
    phone : { type :String},
    Gender : { type :String},
    Address : { type :String},
});


const Users = mongoose.model('Users', userSchema);

module.exports = Users;