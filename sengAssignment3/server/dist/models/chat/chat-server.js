"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSystemServer = void 0;
class ChatSystemServer {
    constructor() {
        this.userNamePools = [
            'user_1',
            'user_2',
            'user_3',
            'user_4',
            'user_5',
            'user_6',
            'user_7',
            'user_8',
            'user_9',
            'user_0',
        ];
        this.chatMessages = [];
        this.userPools = [];
        this.state = {
            userPools: this.userPools,
            messages: this.chatMessages
        };
    }
    getState() {
        return this.state;
    }
    generateUserName() {
        return 'randomizedName';
    }
    addUserToState(user) {
        this.userPools.push(user);
    }
}
exports.ChatSystemServer = ChatSystemServer;
//# sourceMappingURL=chat-server.js.map