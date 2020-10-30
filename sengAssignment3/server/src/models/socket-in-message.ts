export type SocketIncomingMessage = {
    user: string,
    payload: {
        action: string,
        data: { [ key: string ] : string }
    }
}