const mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    period: {
        type: String
    },
    time: {
        type: String
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectID],
        ref: 'User'
    },
    participantsNumber: {
        type: Number
    },
    waitingList: {
        type: [mongoose.Schema.Types.ObjectID],
        ref: 'User'
    },
    owner: {
        type: String
    },
    coordinates: {
        type: Array
    },
    status: {
        type: Boolean
    },
    warnings: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Event', eventSchema);
