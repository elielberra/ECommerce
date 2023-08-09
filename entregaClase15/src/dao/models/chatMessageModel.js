const { Schema, model } = require('mongoose');
const leanHook = require('./hooks/leanHook');

const schema = new Schema({
    user: String,
    message: String,
    datetime: String
});

schema.pre(['findOne', 'find'], leanHook);

const chatMessagesModel = model('chatmessages', schema);

module.exports = chatMessagesModel;
