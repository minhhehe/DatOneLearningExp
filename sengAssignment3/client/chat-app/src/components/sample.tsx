import React, { useState, Component } from 'react';
import Button from 'react-bootstrap/Button';
import { socket } from '../components/socket';

class SampleButton extends React.Component {

    constructor() {
        super({});
        socket.on('testReturn', (data: string) => {
            console.log('data', data)
        });
    }

    testButtonClick(event: React.MouseEvent) {
        socket.emit('testSend', { testData: 'hoho' });
    }

    render() {
        return <React.Fragment>
            <Button variant="primary" onClick={this.testButtonClick}>Dat Button</Button>
            <br></br>
            <Button variant="primary" onClick={this.testButtonClick}>Dat Button</Button>
        </React.Fragment>
        
    }

}

export default SampleButton;