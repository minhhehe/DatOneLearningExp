"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatSystemHandler = require("./chat/chat");
const SocketHandler = {
    load_chat_event(socket, chatServerInstance, io) {
        ChatSystemHandler.default.chatMessageHandler(socket, chatServerInstance, io);
    }
};
exports.default = SocketHandler;
//# sourceMappingURL=socketHandler.js.map