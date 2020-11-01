import React, { useState, Component } from 'react';
import './App.css';
import { socket } from "./components/socket";
import cookiesService from "./controller/cookie-service";
import ChatWindow from './components/chat/chat-window';
import { CommandResult, InitializationMessage, NewStateMessage } from './lib/interface/SocketIncomingMessage';
import { ChatBoxState, ChatUser } from './lib/interface/chat-state';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { OfflineDiv, OnlineDiv } from './components/chat/chat-log';

type AppState = { username: string, chatState: ChatBoxState , showModal: boolean, modalMsg: string, showOnlineModal: boolean, showUserModal: boolean}
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
      username: '',
      showModal: false,
      modalMsg: '',
      showOnlineModal: false,
      showUserModal: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.showOnlineModal = this.showOnlineModal.bind(this);
    this.showUserModal = this.showUserModal.bind(this);
    this.hideOnlineModal = this.hideOnlineModal.bind(this);
    this.hideUserModal = this.hideUserModal.bind(this);
  }

  getUserDiv(user: ChatUser): JSX.Element {
      let retVal: JSX.Element;
      let styles = {}
      if (user.userSettings) {
          if (user.userSettings['color']) {
              styles = {
                  color: '#' + user.userSettings['color']
              }
          }
      }
      
      retVal = (

          <div>
              {user.username === this.state.username ? '(You)' : user.isOnline ? <OnlineDiv>(Online)</OnlineDiv> : <OfflineDiv>(Offline)</OfflineDiv>} <span style={styles}>{user.username}</span>
          </div>
      );
      return retVal;
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
        data.chatBoxState.messages.forEach(message => {
          if (message.date) {
            message.date = new Date(message.date);
          }
        })
        this.chatBoxState = data.chatBoxState;
        this.updateTheChatState();
      }
    });

    socket.on('chat--updateState', (data: NewStateMessage) => {
      if (data.isValid) {
        console.log('data', data);
        data.chatBoxState.lastUpdated = new Date(data.chatBoxState.lastUpdated);
        this.chatBoxState = data.chatBoxState;
        data.chatBoxState.messages.forEach(message => {
          if (message.date) {
            message.date = new Date(message.date);
          }
        })
        this.updateTheChatState();
      }
    });

    socket.on('chat--sendCommand-return', (data: CommandResult) => {
      if (!data.success) {
        this.setState(
          {
            showModal: true,
            modalMsg: data.msg
          }
        )
      } else {
        const username = data.username;
        if (username) {
          cookiesService.set('username', username);
          this.username = username;
          this.updateTheChatState();
        }
      }
    });
  }
  
  updateTheChatState() {
    this.setState({
      username: this.username, 
      chatState: this.chatBoxState
    });
  }

  handleClose() {
    this.setState(
      {showModal: false}
    )
  }

  showOnlineModal() {
    this.setState(
      {showOnlineModal: true}
    )
  }

  hideOnlineModal() {
    this.setState(
      {showOnlineModal: false}
    )
  }

  showUserModal() {
    this.setState(
      {showUserModal: true}
    )
  }

  hideUserModal() {
    this.setState(
      {showUserModal: false}
    )
  }

  render() { 
    const domUser: any[] = [];

    this.state.chatState.userPools.forEach((user, index: number) => {
        domUser.push(
            <Row key={"user_" + index} className="flex-row-reverse ml-2 mr-1">
                {this.getUserDiv(user)}
            </Row>
        )
    });

    return (
    <div className="App">
      <header className="App-header">
        <Row className="d-flex">
          <Col>
            <Button variant="secondary" onClick={this.showOnlineModal}>
              Online
            </Button>
          </Col>
          <Col>
            <Button variant="secondary" onClick={this.showUserModal}>
              Info
            </Button>
          </Col>
        </Row>        
      </header>
        <ChatWindow username={this.username} chatbox={this.state.chatState}/>
        <Modal
          show={this.state.showOnlineModal}
          onHide={this.hideOnlineModal}
          backdrop="static"
          keyboard={false}
        >
        <Modal.Header closeButton>
            <Modal.Title>System Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {domUser}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideOnlineModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showUserModal}
          onHide={this.hideUserModal}
          backdrop="static"
          keyboard={false}
        >
        <Modal.Header closeButton>
            <Modal.Title>System Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.username}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideUserModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showModal}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
        <Modal.Header closeButton>
            <Modal.Title>System Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.modalMsg}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
    );
  }
}

export default App;
