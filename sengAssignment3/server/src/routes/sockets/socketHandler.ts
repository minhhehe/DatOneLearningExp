import socketio from 'socket.io';
import ChatSystemHandler = require('./chat/chat');

import { GenericSocketOutMsg } from './../../models/socket-out-message';
import { SocketIncNewMsg } from './../../models/socket-in-message';
import { ChatSystemServer } from './../../models/chat/chat-server';

const SocketHandler = {

    load_common_event(socket: socketio.Socket) {
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    },

    load_chat_event(socket: socketio.Socket, chatServerInstance: ChatSystemServer){
        ChatSystemHandler.default.chatMessageHandler(socket, chatServerInstance);
    }

}

export default SocketHandler;
