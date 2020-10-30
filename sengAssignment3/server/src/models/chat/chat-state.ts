export interface ChatMessage {
    message: string;
    owner: string;
    date? : Date;
    color? : string;
}

export interface ChatUser {
    username: string;
    isOnline: boolean;
    userSettings: {
        [key: string]: string
    }
}

export interface ChatBoxState {
    userPools: ChatUser[];
    messages: ChatMessage[];
}