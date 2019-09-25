import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

function server() {
  return renderToString(<App />);
}

export default server;