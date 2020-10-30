import React, { useState, Component } from 'react';
import Button from 'react-bootstrap/Button';

class ChatWindow extends React.Component {

    testButtonClick(event: React.MouseEvent) {
        console.log('button pressed');
    }

    render() {
        return <React.Fragment>
            <Button variant="primary" onClick={this.testButtonClick}>Dat Button</Button>
            <br></br>
            <Button variant="primary" onClick={this.testButtonClick}>Dat Button</Button>
        </React.Fragment>
        
    }

}

export default ChatWindow;