import React, { useContext } from 'react';

import { Context } from '../index';

const Message = ({ message }) => {
  const { text, uid, profileURl, createdAt, id } = message;
  const { auth } = useContext(Context);
  const messageType = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageType}`}>
      <div className="message-text">{text}</div>
      <div className="message-user">
        <span className="message-user-name">{uid}</span>
        <img src={profileURl} alt="" />
      </div>
    </div>
  );
};

export default Message;
