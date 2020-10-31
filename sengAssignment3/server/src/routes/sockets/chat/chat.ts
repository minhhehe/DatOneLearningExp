import socketio from 'socket.io';
import { GenericSocketOutMsg, InitializationMessage, NewStateMessage } from './../../../models/socket-out-message';
import { GenericSocketIncMessage } from './../../../models/socket-in-message';
import { ChatSystemServer } from './../../../models/chat/chat-server';
import { ChatUser } from './../../../models/chat/chat-state';


const ChatSystemHandler = {

    addUserToConnectedPool(user: ChatUser, chatServerInstance: ChatSystemServer): void {
        chatServerInstance.addUserToState(user);
    },

    getRandomUserName(): string {
        return '';
    },

    chatMessageHandler(socket: socketio.Socket, chatServerInstance: ChatSystemServer) {
        socket.on('chat--initialization', (data: GenericSocketIncMessage) => {
            console.log('chat--initialization', data);
            const response: InitializationMessage = {
                isValid: true,
                chatBoxState: chatServerInstance.getState(),
                username: '',
                user: null
            }

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


}

export default ChatSystemHandler;