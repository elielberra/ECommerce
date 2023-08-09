const { Router } = require('express');
const chatMessageManager = require('../../dao/managers/mongoDB/chatMessageManager');

const router = Router();
router.get('/', async (req, res) => {
    const isAdminBoolean = req.user.role === 'admin';
    const messages = await chatMessageManager.getMessages();
    res.render('chat', {
        messages: messages,
        user: {
            ...req.user,
            isAdmin: isAdminBoolean
        },
        jsFilename: 'chat',
        styleFilename: 'chat',
        loadSweetAlert: true
    });
});

router.post('/new-message', async (req, res) => {
    const { body: message } = req;
    try {
        const newProduct = await chatMessageManager.addMessage(message);
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
module.exports = router;
