import React from 'react';
// import Analytics from 'react-ga';
import axios from 'axios'
import './index.scss';

export default function App() {

  React.useEffect(() => {
    const key = 'need to set an active key!!'
    Analytics.initialize(key);
    Analytics.pageview(window.location.pathname);
  });

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