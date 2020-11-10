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
            message: 'This is the start of the chat. To change username, type /name newname. To Change color, type /color hexcode',
            owner: this.theSystem,
            date: new Date()
        };
        this.chatMessages = [this.initialMessage];
        this.userPools = [this.theSystem];
        this.socketDict = {};
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
        this.state.lastUpdated = new Date();
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
    mapSocketIDToUserName(socketID, username) {
        this.socketDict[socketID] = username;
    }
    takeUserOffline(socketID) {
        const username = this.socketDict[socketID];
        if (this.userDict[username])
            this.userDict[username].isOnline = false;
    }
    getAUser(username) {
        if (this.userDict[username]) {
            this.userDict[username].isOnline = true;
            return this.userDict[username];
        }
        else {
            return this.generateUser();
        }
    }
    changeUserName(oldUserName, newUserName) {
        if (this.userDict[newUserName]) {
            return {
                success: false,
                msg: 'Username has already been taken'
            };
        }
        if (this.userDict[oldUserName]) {
            this.userDict[newUserName] = this.userDict[oldUserName];
            this.userDict[oldUserName] = null;
            this.userDict[newUserName].username = newUserName;
            return {
                success: true,
                msg: 'Success'
            };
        }
        else {
            return {
                success: false,
                msg: 'Username does not exist'
            };
        }
    }
    addUserToState(user) {
        this.userPools.push(user);
    }
    addNewMessage(message, username) {
        const theUser = this.getAUser(username);
        const theMessage = {
            owner: theUser,
            message,
            date: new Date()
        };
        this.chatMessages.push(theMessage);
        if (this.state.messages.length > 200) {
            this.state.messages.shift();
        }
        this.updateStateDate();
    }
    updateStateDate() {
        this.state.lastUpdated = new Date();
    }
    handleCommands(username, command, commandParam) {
        const retVal = {
            success: false,
            msg: '',
            username
        };
        switch (command) {
            case 'color':
                if (!commandParam || commandParam.length !== 6) {
                    retVal.msg = 'Color command argument should be RRGGBB.';
                    return retVal;
                }
                else {
                    if (!(/^[0-9A-F]{6}$/i.test(commandParam))) {
                        retVal.msg = 'Invalid color code.';
                    }
                    else {
                        this.userDict[username].userSettings.color = commandParam;
                        this.updateStateDate();
                        retVal.success = true;
                    }
                }
                break;
            case 'name':
                if (commandParam) {
                    const tempRetVal = this.changeUserName(username, commandParam);
                    if (tempRetVal.success) {
                        retVal.success = tempRetVal.success;
                        retVal.username = commandParam;
                        this.updateStateDate();
                    }
                    else {
                        retVal.msg = tempRetVal.msg;
                    }
                }
                break;
            default:
                retVal.msg = 'Invalid Command';
        }
        return retVal;
    }
}
exports.ChatSystemServer = ChatSystemServer;
//# sourceMappingURL=chat-server.js.map