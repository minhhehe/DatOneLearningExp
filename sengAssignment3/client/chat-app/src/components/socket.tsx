import socketIOClient from "socket.io-client";
import cookiesService from "./../controller/cookie-service";

// let socket: SocketIOClient.Socket = socketIOClient('http://93cdee5f9fbd.ngrok.io');
let socket: SocketIOClient.Socket = socketIOClient('http://localhost:8080');
let username = cookiesService.get('username');
socket.emit('chat--initialization', { username: username, payload: { action: '' } })

export { socket };