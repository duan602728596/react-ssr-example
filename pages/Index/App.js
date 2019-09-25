import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import style from './app.css';

class App extends Component {
  render() {
    return (
      <div className={ style.colors }>
        <h4>Index</h4>
        <img className={ style.img } src={ require('./image.jpg') } />
      </div>
    );
  }
}

export default hot(module)(App);