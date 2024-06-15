const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    playerName: { type: String, required: true },
    score: { type: Number, required: true }
});

module.exports = mongoose.model('Score', scoreSchema);
