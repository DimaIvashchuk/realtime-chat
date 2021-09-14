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
  const {db, auth, storage} = useContext(Context);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState(null);
  const [roomNameToJoin, setRoomNameToJoin] = useState('');
  const fileInputRef = useRef(null);
  const chatRef = useRef(null);
  const messageDb = db.collection('messages');

  const query = messageDb.where('room', '==', room).orderBy('createdAt');
  const [messages] = useCollectionData(query, { idField: 'id' });

  const sendMessage = async (e) => {
    e.preventDefault();
    let fileUrl = '';
    if (fileInputRef.current.files[0]) {
      const file = fileInputRef.current.files[0];
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);
      
      await fileRef.put(file);

      fileUrl = await fileRef.getDownloadURL();

      fileInputRef.current.value = null;
    }
    const { photoURL, uid, displayName } = auth.currentUser;
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();

    messageDb.add({
      uid,
      photoURL,
      text: message,
      createdAt,
      room,
      username: displayName,
      fileUrl
    });
  };

  const joinRoom = async(e) => {
    e.preventDefault();

    if (availableRooms.includes(roomNameToJoin)) {
      setRoom(roomNameToJoin);
      return;
    }

    const { data: serverResponce } = await axios.post('https://us-central1-dev-temp-de742.cloudfunctions.net/app/api/v1/room', {
      title: roomNameToJoin
    });

    if (serverResponce.status === 'ok') {
      setRoom(serverResponce.data.title);
    }
  }

  useEffect(() => {
    const getRoomsData = async () => {
      const { data: serverResponce } = await axios.get('https://us-central1-dev-temp-de742.cloudfunctions.net/app/api/v1/room');

      if (serverResponce.status === 'ok') {
        setAvailableRooms(serverResponce.data.map(room => room.title));
      }
    }

    getRoomsData();
    
    return () => {};
  }, []);

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);
 
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
        <div className="chat-content-messeges" ref={chatRef}>
          {messages && messages.map(element => <Message message={element} key={element.id}/>)}
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
            <input type="file" ref={fileInputRef} />
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
