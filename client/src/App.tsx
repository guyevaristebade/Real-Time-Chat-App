import React, { useEffect, useState } from 'react'
import './App.css'
import { useSocket } from './hooks';

function App() {
  const { socket } = useSocket();
  const [message, setMessage] = useState<string>('');


  const onChangeMessage = (e : React.ChangeEvent<HTMLInputElement>) =>{
    const value : string = e.target.value
    setMessage(value)
    console.log(message)
  }

  const onSubmit = (e : React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    socket.emit("chat message",message )
    setMessage('');
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.off('reconnect_attempt');
      socket.close();
    };
  }, []);
  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="message"></label>
        <input type="text" id="message" name='message' onChange={onChangeMessage} value={message} />
        <button id="send">Send</button>
      </form>
    </>
  )
}

export default App
