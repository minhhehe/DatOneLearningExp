"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSystemServer = void 0;
class ChatSystemServer {
    constructor() {
        this.lastNamePool = [
            'Dolphin',
            'Whale',
            'Duck',
            'Kilin',
            'Dog',
            'Cat',
            'Turtle',
            'Dragon',
            'Eagle',
            'Phoenix',
            'Snowflake',
            'Leaf'
        ];
        this.firstNamePool = [
            'Colossal',
            'Giant',
            'Big',
            'Huge',
            'Normal',
            'Medium-sized',
            'Majestic',
            'Small',
            'Tiny',
            'Non-existent'
        ];
        this.theSystem = {
            username: 'The bot',
            isOnline: true,
            userSettings: {}
        };
        this.initialMessage = {
            message: 'This is the start of the chat.',
            owner: this.theSystem
        };
        this.chatMessages = [this.initialMessage];
        this.userPools = [this.theSystem];
        this.userDict = {
            'The bot': this.theSystem
        };
        this.state = {
            userPools: this.userPools,
            messages: this.chatMessages,
            lastUpdated: new Date()
        };
    }
    getState() {
        return this.state;
    }
    generateUser() {
        let username = this.firstNamePool[Math.floor(Math.random() * 10)] + ' ' + this.lastNamePool[Math.floor(Math.random() * 10)];
        while (this.userDict[username]) {
            username = this.firstNamePool[Math.floor(Math.random() * 10)] + ' ' + this.lastNamePool[Math.floor(Math.random() * 10)];
        }
        const newUser = {
            username,
            isOnline: true,
            userSettings: {}
        };
        this.userDict[username] = newUser;
        this.userPools.push(newUser);
        return newUser;
    }
    getAUser(username) {
        if (this.userDict[username]) {
            return this.userDict[username];
        }
        else {
            return this.generateUser();
        }
    }
    changeUserName(oldUserName, newUserName) {
        if (this.userDict[oldUserName]) {
            this.userDict[newUserName] = this.userDict[oldUserName];
            this.userDict[oldUserName] = null;
            this.userDict[newUserName].username = newUserName;
        }
    }
    addUserToState(user) {
        this.userPools.push(user);
    }
    addNewMessage(message) {
        this.chatMessages.push(message);
        this.updateStateDate();
    }
    updateStateDate() {
        this.state.lastUpdated = new Date();
    }
}
exports.ChatSystemServer = ChatSystemServer;
//# sourceMappingURL=chat-server.js.map