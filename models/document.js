const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    title: {
        type: String, 
        required: true
    }, 
    content:{
        type: String, 
        required: true
    }
})

const Documents = module.exports = mongoose.model('documents', documentSchema);

module.exports.getAll = (callback) => {
    Documents.find(callback);
}

module.exports.getById = (id, callback) => {
    Documents.findById(id, callback);
}

module.exports.getByFilter = (filter, callback) => {
    Documents.find({ content: { "$regex": filter, "$options": "ix" }}, callback);
}