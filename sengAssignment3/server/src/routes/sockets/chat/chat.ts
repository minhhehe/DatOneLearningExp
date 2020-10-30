import socketio from 'socket.io';
import { SocketOutgoingMessage } from './../../../models/socket-out-message';
import { SocketIncomingMessage } from './../../../models/socket-in-message';
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
        socket.on('chat--initialization', (data: SocketIncomingMessage) => {
            console.log('chat--initialization', data);
            const response: SocketOutgoingMessage = {
                isValid: true,
                payload: {

                }
            }

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

        socket.on('testSend', (data: SocketIncomingMessage) => {
            console.log('testReturn', { res: 'lolo' });

            const response: SocketOutgoingMessage = {
                isValid: true,
                payload: {

                }
            }

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


}

export default ChatSystemHandler;