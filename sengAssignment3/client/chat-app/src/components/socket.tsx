import React, { Component } from "react";
import socketIOClient from "socket.io-client";

let socket: SocketIOClient.Socket = socketIOClient('http://localhost:8080');
socket.emit('chat--initialization', { user: '', payload: { action: '' } })

export { socket };