import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { ChatBoxState, ChatMessage, ChatUser } from '../../lib/interface/chat-state';


type ChatWindowProps = { chatbox: ChatBoxState, username: string }
type ChatWindowState = { chatbox: ChatBoxState, username: string }
class ChatWindow extends React.Component<ChatWindowProps, ChatWindowState> {

    testButtonClick(event: React.MouseEvent) {
        console.log('button pressed');
    }

    constructor(props: ChatWindowProps) {
        super(props);
        this.state = {
            chatbox: {
                userPools: [],
                messages: [],
                lastUpdated: new Date('July 20, 99 00:20:18 GMT+00:00')
            },
            username: ''
        };
    }

    updateChatWindow(newChatBoxState: ChatBoxState) {
        this.setState(
            {
                chatbox: newChatBoxState
            }
        )
    }

    updateUserWindow(newChatBoxState: ChatBoxState) {
        this.setState(
            {
                chatbox: newChatBoxState
            }
        )
    }

    componentDidUpdate(prevProps: ChatWindowProps, prevState: ChatWindowState, snapshot: any) {
        console.log('in componentDidUpdate');
        if (this.props.chatbox.lastUpdated.getTime() > prevProps.chatbox.lastUpdated.getTime()) {
            this.updateChatWindow(this.props.chatbox);
        }

        if (this.props.chatbox.lastUpdated.getTime() > prevProps.chatbox.lastUpdated.getTime()) {
            this.updateChatWindow(this.props.chatbox);
        }
    }

    getMessageOwnerDiv(owner: ChatUser): JSX.Element {
        if (owner.userSettings) {
            if (owner.userSettings['color']) {

            }
        }
        return (
            <div>
                {owner.username} said:
            </div>
        )
    }

    getMessageDiv(message: ChatMessage, username: string): JSX.Element {
        return (
            <div>
                
            </div>
        )
    }

    render() {
        const domMessage: any[] = [];

        this.state.chatbox.messages.forEach((message, index: number) => {
            


            domMessage.push(
                <Row key={index}>
                    {this.getMessageOwnerDiv(message.owner)}
                    <div>
                        {message.message}
                    </div>
                </Row>
            )
        });
        
        return <React.Fragment>
                <Container>
                    {domMessage}
                </Container>
                <br></br>
                <Button variant="primary" onClick={this.testButtonClick}>Send</Button>
        </React.Fragment>
        
    }

}

export default ChatWindow;