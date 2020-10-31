"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatSystemHandler = {
    addUserToConnectedPool(user, chatServerInstance) {
        chatServerInstance.addUserToState(user);
    },
    getRandomUserName() {
        return '';
    },
    chatMessageHandler(socket, chatServerInstance) {
        socket.on('chat--initialization', (data) => {
            console.log('chat--initialization', data);
            const response = {
                isValid: true,
                chatBoxState: chatServerInstance.getState(),
                username: '',
                user: null
            };
            if (!data.username) {
                response.isValid = true;
                response.user = chatServerInstance.generateUser();
                response.username = response.user.username;
                socket.emit('chat--initialization-return', response);
            }
            else {
                response.isValid = true;
                response.user = chatServerInstance.getAUser(data.username);
                response.username = response.user.username;
                socket.emit('chat--initialization-return', response);
            }
        });
        socket.on('chat--sendMessage', (data) => {
            console.log('chat--sendMessage', data);
        });
    }
};
exports.default = ChatSystemHandler;
//# sourceMappingURL=chat.js.map