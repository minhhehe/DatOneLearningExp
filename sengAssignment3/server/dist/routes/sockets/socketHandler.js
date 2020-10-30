"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatSystemHandler = require("./chat/chat");
const SocketHandler = {
    load_common_event(socket) {
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    },
    load_chat_event(socket, chatServerInstance) {
        ChatSystemHandler.default.chatMessageHandler(socket, chatServerInstance);
    }
};
exports.default = SocketHandler;
//# sourceMappingURL=socketHandler.js.map