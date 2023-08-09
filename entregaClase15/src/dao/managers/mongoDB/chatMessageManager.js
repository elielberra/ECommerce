const chatMessagesModel = require('../../models/chatMessageModel');

class ChatMessageManager {
    async getMessages() {
        try {
            const messages = await chatMessagesModel.find();
            return messages;
        } catch (error) {
            console.error('Error while trying to get the chat messages:\n', error);
        }
    }

    async addMessage(message) {
        process.env.VERBOSE &&
            console.log('A new message will be added. The new message is:\n', message);
        const newMessage = await chatMessagesModel.create(message);
        process.env.VERBOSE &&
            console.log('The message has been successfully saved on the Database');
        return newMessage;
    }
}

module.exports = new ChatMessageManager();
