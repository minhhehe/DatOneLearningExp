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
                payload: {}
            };
            if (!data.user) {
                response.isValid = true;
                response.payload.username = chatServerInstance.generateUserName();
                socket.emit('testReturn', response);
            }
            else {
                socket.emit('testReturn', data);
            }
        });
        socket.on('chat--sendMessage', (data) => {
            console.log('chat--sendMessage', data);
        });
        socket.on('testSend', (data) => {
            console.log('testReturn', { res: 'lolo' });
            const response = {
                isValid: true,
                payload: {}
            };
            if (!data.user) {
                response.isValid = false;
                response.errorMessage = 'user is missing';
                socket.emit('testReturn', response);
            }
            else {
                socket.emit('testReturn', data);
            }
        });
    }
};
exports.default = ChatSystemHandler;
//# sourceMappingURL=chat.js.map