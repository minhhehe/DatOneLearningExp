export interface GenericSocketIncMessage {
    username: string
}

export interface SocketIncNewMsg extends GenericSocketIncMessage {
    message: string
}

export interface SocketIncCommand extends GenericSocketIncMessage {
    command: string,
    commandParam: string
}