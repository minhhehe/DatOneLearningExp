import socketio from 'socket.io';
import ChatSystemHandler = require('./chat/chat');
import { ChatSystemServer } from './../../models/chat/chat-server';

const SocketHandler = {


    load_chat_event(socket: socketio.Socket, chatServerInstance: ChatSystemServer, io: socketio.Server){
        ChatSystemHandler.default.chatMessageHandler(socket, chatServerInstance, io);
    }

}

export default SocketHandler;
