"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatSystemHandler = {
    addUserToConnectedPool(user, chatServerInstance) {
        chatServerInstance.addUserToState(user);
    },
    getRandomUserName() {
        return '';
    },
    chatMessageHandler(socket, chatServerInstance, io) {
        socket.on('chat--initialization', (data) => {
            console.log('chat--initialization', data);
            const response = {
                isValid: true,
                chatBoxState: chatServerInstance.getState(),
                username: '',
                user: null
            };
            if (!data.username) {
                response.user = chatServerInstance.generateUser();
            }
            else {
                response.user = chatServerInstance.getAUser(data.username);
            }
            response.isValid = true;
            response.username = response.user.username;
            chatServerInstance.mapSocketIDToUserName(socket.id, response.username);
            socket.emit('chat--initialization-return', response);
            io.emit('chat--updateState', response);
        });
        socket.on('chat--sendMessage', (data) => {
            console.log('chat--sendMessage', data);
            chatServerInstance.addNewMessage(data.message, data.username);
            const response = {
                isValid: true,
                chatBoxState: chatServerInstance.getState()
            };
            io.emit('chat--updateState', response);
        });
        socket.on('chat--sendCommand', (data) => {
            console.log('chat--sendCommand', data);
            const retVal = chatServerInstance.handleCommands(data.username, data.command, data.commandParam);
            console.log('result ', retVal);
            if (retVal.success) {
                chatServerInstance.mapSocketIDToUserName(socket.id, retVal.username);
                const response = {
                    isValid: true,
                    chatBoxState: chatServerInstance.getState()
                };
                io.emit('chat--updateState', response);
            }
            socket.emit('chat--sendCommand-return', retVal);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
            chatServerInstance.takeUserOffline(socket.id);
            const response = {
                isValid: true,
                chatBoxState: chatServerInstance.getState()
            };
            io.emit('chat--updateState', response);
        });
    }
};
exports.default = ChatSystemHandler;
//# sourceMappingURL=chat.js.map