const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    country: {
        type: String
    },
    address: {
        type: String
    },
    gender: {
        type: String
    },
    status: {
        type: String
    },
    hospital: {
        type: String
    },
    numvac: {
        type: String
    },
    vac: {
        type: String
    },
    daypoint: {
        type: String
    },
    timepoint: {
        type: String
    },
    symtomps: {
        type: String
    },
    
}, {versionKey: false },{
    collection: "users"
})

module.exports = mongoose.model('user', userSchema);