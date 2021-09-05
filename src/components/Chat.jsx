import React, { useState, useRef, useContext, useEffect } from 'react';
import firebase from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import axios from 'axios';
import { Button } from '@rmwc/button';
import { TextField } from '@rmwc/textfield';
import { Typography } from '@rmwc/typography';

import { Context } from '../index';
import Message from './Message';

const Chat = () => {
  const {db, auth} = useContext(Context);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState(null);
  const [roomNameToJoin, setRoomNameToJoin] = useState('');
  const fileRef = useRef(null);
  const messageDb = db.collection('messages');

  const query = messageDb.where('room', '==', room);
  const [messages] = useCollectionData(query, { idField: 'id' });
  console.log(messages);

  const sendMessage = (e) => {
    e.preventDefault();
    const { photoURL, uid} = auth.currentUser;
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();

    messageDb.add({
      uid,
      photoURL,
      text: message,
      createdAt,
      room
    });
  };

  const joinRoom = async(e) => {
    e.preventDefault();

    if (availableRooms.includes(roomNameToJoin)) {
      setRoom(roomNameToJoin);
      return;
    }

    const { data: serverResponce } = await axios.post('http://localhost:5000/api/v1/room', {
      title: roomNameToJoin
    });

    if (serverResponce.status === 'ok') {
      setRoom(serverResponce.data.title);
    }
  }

  useEffect(() => {
    if (room !== null) {

    }
  }, [room]);

  useEffect(() => {
    console.log('a')
    const getRoomsData = async () => {
      const { data: serverResponce } = await axios.get('http://localhost:5000/api/v1/room');

      if (serverResponce.status === 'ok') {
        console.log(serverResponce, serverResponce.data.map(room => room.title))
        setAvailableRooms(serverResponce.data.map(room => room.title));
      }
    }

    getRoomsData();
    
    return () => {};
  }, []);
 
  return (
    <div className="chat">
      <form className="chat-header" onSubmit={(e) => joinRoom(e)}>
        <TextField
          value={roomNameToJoin}
          label="Group name"
          style={{ height: '40px', width: '80%' }}
          onChange={(e) => setRoomNameToJoin(e.target.value)}
        />
        <Button style={{ backgroundColor: '#ae00c5', height: '40px', width: '20%' }} label="Join / Create" raised type="submit" />
      </form>
      <div className="chat-content">
        <Typography use="headline3">{room}</Typography>
        <div className="chat-content-messeges">
          {messages && messages.map(element => <Message message={element}/>)}
        </div>
      </div>
      <div className="chat-controls">
        <form onSubmit={sendMessage} style={{ width: '100%', display: 'flex' }}>
          <TextField
            placeholder="Type..."
            style={{ height: '40px', width: '70%' }}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <label className="chat-controls__file" style={{ height: '40px', width: '10%', borderLeft: '1px solid #505050' }} >
            Choose the file
            <input type="file" ref={fileRef} />
          </label>
          <Button
            style={{ backgroundColor: '#ae00c5', height: '40px', width: '20%' }}
            label="Send"
            raised 
            type="submit"
            disabled={room === null}
          />
        </form>
        </div>
    </div>
  );
};

export default Chat;
