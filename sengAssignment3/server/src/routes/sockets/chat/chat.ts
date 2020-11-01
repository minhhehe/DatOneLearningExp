import socketio from 'socket.io';
import { GenericSocketOutMsg, InitializationMessage, NewStateMessage } from './../../../models/socket-out-message';
import { GenericSocketIncMessage, SocketIncCommand, SocketIncNewMsg } from './../../../models/socket-in-message';
import { ChatSystemServer } from './../../../models/chat/chat-server';
import { ChatUser } from './../../../models/chat/chat-state';


const ChatSystemHandler = {

    addUserToConnectedPool(user: ChatUser, chatServerInstance: ChatSystemServer): void {
        chatServerInstance.addUserToState(user);
    },

    getRandomUserName(): string {
        return '';
    },

    chatMessageHandler(socket: socketio.Socket, chatServerInstance: ChatSystemServer, io: socketio.Server) {
        socket.on('chat--initialization', (data: GenericSocketIncMessage) => {
            console.log('chat--initialization', data);
            const response: InitializationMessage = {
                isValid: true,
                chatBoxState: chatServerInstance.getState(),
                username: '',
                user: null
            }

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

        socket.on('chat--sendMessage', (data: SocketIncNewMsg) => {
            console.log('chat--sendMessage', data);
            chatServerInstance.addNewMessage(data.message, data.username);

            const response: NewStateMessage = {
                isValid: true,
                chatBoxState: chatServerInstance.getState()
            }

            io.emit('chat--updateState', response)
        });

        socket.on('chat--sendCommand', (data: SocketIncCommand) => {
            console.log('chat--sendCommand', data);

            const retVal = chatServerInstance.handleCommands(data.username, data.command, data.commandParam)
            console.log('result ', retVal);
            if (retVal.success) {
                chatServerInstance.mapSocketIDToUserName(socket.id, retVal.username);
                const response: NewStateMessage = {
                    isValid: true,
                    chatBoxState: chatServerInstance.getState()
                }
                io.emit('chat--updateState', response);
            }
            socket.emit('chat--sendCommand-return', retVal);


        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            chatServerInstance.takeUserOffline(socket.id);
            const response: NewStateMessage = {
                isValid: true,
                chatBoxState: chatServerInstance.getState()
            }
            io.emit('chat--updateState', response);
        });

    }


}

export default ChatSystemHandler;