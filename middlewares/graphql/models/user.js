const mongoose = require('mongoose');
const schema = mongoose.Schema;
mongoose.Promise = Promise;

let userSchema = new schema({
    fname: {
        type: String
    },
    lname:{
        type: String
    },
    reg:{
        type: String,
        unique: true
    },
    email:{
        type: String,
        unique: true
    },
    phone:{
        type: String,
        unique: true
    },
    password:{
        type: String
    },
    google: {
        type: Boolean
    }
},{collection: 'authentication'});

let user = module.exports = mongoose.model('user', userSchema, 'authentication');

// module.exports.getDetails = function(reg, callback){
//     user.findOne({reg: reg}, callback);
// };
//
// module.exports.addDetails = function(details, callback){
//     user.create(details, callback);
// };

// module.exports.getById = function(id, callback){
//     user.findById(id, callback);
// };
