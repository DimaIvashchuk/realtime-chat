import React, { useContext } from 'react';

import { Context } from '../index';

const Message = ({ message }) => {
  const { text, uid, photoURL, createdAt, username, fileUrl } = message;
  const { auth } = useContext(Context);
  const messageType = uid === auth.currentUser.uid ? 'sent' : 'received';

  const timestamp = new Date(0);
  if (createdAt === null) return null;
  timestamp.setSeconds(createdAt.seconds)
  const messageTimestamp = timestamp.toLocaleString('eu-UA', {hour:'2-digit', minute:'2-digit', second: '2-digit'})

  return (
    <div className={`message ${messageType}`}>
      <div className="message-user">
        <span>{messageTimestamp}</span>
        <span className="message-user-name">{username}</span>
        <img className="message-user-img" src={photoURL} alt="" />
      </div>
      <span className="message-text">{text}</span>
      {fileUrl && <img src={fileUrl} alt="hello" />}
    </div>
  );
};

export default Message;
