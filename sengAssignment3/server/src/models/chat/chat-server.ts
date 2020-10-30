import { ChatBoxState, ChatMessage, ChatUser } from './chat-state';

export class ChatSystemServer {
    userNamePools: string[] = [
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

    chatMessages: ChatMessage[] = [];

    userPools: ChatUser[] = [];

    state: ChatBoxState = {
        userPools: this.userPools,
        messages: this.chatMessages
    }

    getState(): ChatBoxState {
        return this.state;
    }

    generateUserName(): string {
        return 'randomizedName';
    }

    addUserToState(user: ChatUser): void {
        this.userPools.push(user);
    }


}