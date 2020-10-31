import { ChatBoxState, ChatMessage, ChatUser } from './chat-state';

export class ChatSystemServer {
    lastNamePool: string[] = [
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

    firstNamePool: string[] = [
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

    theSystem: ChatUser = {
        username: 'The bot',
        isOnline: true,
        userSettings: {

        }
    }

    initialMessage: ChatMessage = {
        message: 'This is the start of the chat.',
        owner: this.theSystem
    }

    chatMessages: ChatMessage[] = [this.initialMessage];

    userPools: ChatUser[] = [this.theSystem];

    userDict: {[key: string]: ChatUser } = {
        'The bot': this.theSystem
    }

    state: ChatBoxState = {
        userPools: this.userPools,
        messages: this.chatMessages,
        lastUpdated: new Date()
    }

    getState(): ChatBoxState {
        return this.state;
    }

    generateUser(): ChatUser {
        let username = this.firstNamePool[Math.floor(Math.random() * 10)] + ' ' + this.lastNamePool[Math.floor(Math.random() * 10)];
        while (this.userDict[username]) {
            username = this.firstNamePool[Math.floor(Math.random() * 10)] + ' ' + this.lastNamePool[Math.floor(Math.random() * 10)];
        }
        const newUser: ChatUser = {
            username,
            isOnline: true,
            userSettings: {

            }
        }
        this.userDict[username] = newUser;
        this.userPools.push(newUser);

        return newUser;
    }

    getAUser(username: string): ChatUser {
        if (this.userDict[username]) {
            return this.userDict[username];
        } else {
            return this.generateUser();
        }
    }

    changeUserName(oldUserName: string, newUserName: string): void {
        if (this.userDict[oldUserName]) {
            this.userDict[newUserName] = this.userDict[oldUserName];
            this.userDict[oldUserName] = null;
            this.userDict[newUserName].username = newUserName;
        }
    }

    addUserToState(user: ChatUser): void {
        this.userPools.push(user);
    }

    addNewMessage(message: ChatMessage): void {
        this.chatMessages.push(message);
        this.updateStateDate();
    }

    updateStateDate(): void {
        this.state.lastUpdated = new Date();
    }

}