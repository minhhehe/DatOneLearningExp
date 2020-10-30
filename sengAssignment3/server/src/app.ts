import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import http from 'http';
import socketio from 'socket.io';

import indexRouter = require("./routes/index");
import usersRouter = require("./routes/restapi/users");
import SocketHandler = require("./routes/sockets/socketHandler");
import corsSocketOptions from "./corsOption/corsSocket";
import { ChatSystemServer } from './models/chat/chat-server';

const app = express();

const serverHttp = http.createServer(app);
const io = socketio(serverHttp, corsSocketOptions);

// place this middleware before any other route definitions
// makes io available as req.io in all request handlers

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const chatServerInstance = new ChatSystemServer();

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  SocketHandler.default.load_common_event(socket);
  SocketHandler.default.load_chat_event(socket, chatServerInstance);


});


app.set('io', io);

// const theApp = app; // for restAPi
const theApp = serverHttp; // for socket
export = theApp;
