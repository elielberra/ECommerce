const chatMessageManager = require('../dao/managers/mongoDB/chatMessageManager');

async function socketHandler(socket) {
    process.env.VERBOSE &&
        console.log(
            `A new connection has been established with this socket with the id: ${socket.id}`
        );

    const previousMessages = await chatMessageManager.getMessages();
    socket.emit('load-chat-messages', previousMessages);

    socket.on('user-action', ({ user, action }) => {
        if (action === 'joined') {
            socket.user = user;
        }
        socket.broadcast.emit('user-action-render', { user, action });
    });

    socket.on('new-message', async message => {
        await chatMessageManager.addMessage(message);
        socket.broadcast.emit('new-message-render', message);
    });

    socket.on('disconnect', () => {
        process.env.VERBOSE && console.log(`The connection with the id ${socket.id} has closed`);
        socket.broadcast.emit('user-action-render', {
            user: socket.user,
            action: 'exited'
        });
    });
}

module.exports = socketHandler;
