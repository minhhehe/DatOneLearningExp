"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/restapi/users");
const SocketHandler = require("./routes/sockets/socketHandler");
const corsSocket_1 = __importDefault(require("./corsOption/corsSocket"));
const chat_server_1 = require("./models/chat/chat-server");
const app = express_1.default();
const serverHttp = http_1.default.createServer(app);
const io = socket_io_1.default(serverHttp, corsSocket_1.default);
// place this middleware before any other route definitions
// makes io available as req.io in all request handlers
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(http_errors_1.default(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
const chatServerInstance = new chat_server_1.ChatSystemServer();
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    SocketHandler.default.load_chat_event(socket, chatServerInstance, io);
});
app.set('io', io);
// const theApp = app; // for restAPi
const theApp = serverHttp; // for socket
module.exports = theApp;
//# sourceMappingURL=app.js.map