import React, { useState, Component } from 'react';
import './App.css';
import { socket } from "./components/socket";
import cookiesService from "./controller/cookie-service";
import ChatWindow from './components/chat/chat-window';
import { InitializationMessage } from './lib/interface/SocketIncomingMessage';
import { ChatBoxState } from './lib/interface/chat-state';

type AppState = { username: string, chatState: ChatBoxState }
class App extends React.Component<{}, AppState> {

  chatBoxState: ChatBoxState = {
    userPools: [],
    messages: [],
    lastUpdated: new Date('July 20, 99 00:20:18 GMT+00:00')
  }

  username: string = '';

  constructor(props: any) {
    super(props);
    this.state = {
      chatState: this.chatBoxState,
      username: ''
    };
  }

  componentDidMount() {
    socket.on('chat--initialization-return', (data: InitializationMessage) => {
      if (data.isValid) {
        console.log('data', data);
        const username = data.username;
        if (username) {
          cookiesService.set('username', username);
          this.username = username;
        }
        data.chatBoxState.lastUpdated = new Date(data.chatBoxState.lastUpdated);
        this.chatBoxState = data.chatBoxState;
        this.updateTheChatState();
      }
    });
  }
  
  updateTheChatState() {
    this.setState({
      username: this.username, 
      chatState: this.chatBoxState
    });
  }

  render() { 
    return (
    <div className="App">
      <header className="">
      </header>
        <ChatWindow username={this.username} chatbox={this.state.chatState}/>
    </div>
    );
  }
}

export default App;
