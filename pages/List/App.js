import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import style from './app.css';

class App extends Component {
  render() {
    return (
      <div>
        <h4>Title</h4>
        <ul className={ style.list }>
          <li>0. Item 0</li>
          <li>1. Item 1</li>
          <li>2. Item 2</li>
        </ul>
      </div>
    );
  }
}

export default hot(module)(App);