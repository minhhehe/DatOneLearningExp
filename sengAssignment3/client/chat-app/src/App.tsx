import React, { useState, Component } from 'react';
import logo from './logo.svg';
import SampleButton from './components/sample';
import './App.css';
import { socket } from "./components/socket";


function App() {

  const [response, setResponse] = useState('');

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <SampleButton />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
