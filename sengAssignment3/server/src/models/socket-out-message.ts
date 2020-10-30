export interface SocketOutgoingMessage {
    isValid: boolean,
    errorMessage?: string,
    payload: {
        [ key: string ] : any
    }
}