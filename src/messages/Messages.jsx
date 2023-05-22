import React, { useEffect, useState } from 'react';

import ContactsContainer from './ContactsContainer';
import MessagesContainer from './MessagesContainer';

import classes from './Messages.module.css';
const Messages = () => {
  const [dataTransfer, setDataTransfer] = useState([]);
  const [data, setData] = useState([]);
  const handleLiftData = (a, b, c) => {
    setData({ username: a, id: b, src: c });
  };
  useEffect(() => {
    if (data) {
      setDataTransfer(data);
    }
  }, [data]);

  return (
    <div className={classes.messages}>
      <ContactsContainer liftData={handleLiftData} />
      <MessagesContainer data={dataTransfer} />
    </div>
  );
};

export default Messages;
