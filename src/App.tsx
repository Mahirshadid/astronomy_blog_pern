import React from 'react';
import logo from './logo1.png';
import './App.css';
import redirectHook from './hooks/useRedirect'

function App() {
  redirectHook('/homepage', 5000);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to my astronomy talks.
        </p>
      </header>
    </div>
  );
}

export default App;