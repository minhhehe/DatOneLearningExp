"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* GET home page. */
router.get('/', (req, res, next) => {
    res.send('kalala');
});
/* GET home page. */
router.get('/chatState', (req, res, next) => {
    const io = res.app.get('io');
    io.on('connection', socket => {
        socket.on('submitChatMessage', (something) => {
            console.log('got a message', something);
            io.emit('messageReceived', 'hohoho');
        });
    });
    res.send('kalala');
});
const socketRouter = router;
module.exports = socketRouter;
//# sourceMappingURL=chat.js.map