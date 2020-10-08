import React from 'react';
import axios from 'axios'
import './index.scss';

export default function App() {
  return (
    <main>
      <button onClick={() => {
        axios.post('/', { message: 'this a message from react to max' })
      }}>
        click me to talk to max
      </button>
    </main>
  );
}