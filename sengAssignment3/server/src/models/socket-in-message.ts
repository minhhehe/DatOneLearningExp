export interface GenericSocketIncMessage {
    username: string
}

export interface SocketIncNewMsg extends GenericSocketIncMessage {
    payload: any
}