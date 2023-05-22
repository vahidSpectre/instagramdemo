import { Avatar, CircularProgress } from '@mui/material';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { db } from '../Firebase/firebase';

import { AuthContext } from '../context/AuthContext';

import classes from './ShareModalContactBox.module.css';
const ShareModalContactBox = (props) => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSendPost = () => {
    setSending(true);
    const ref = doc(db, 'messages', currentUser.uid);
    const sendData = async () => {
      await updateDoc(ref, {
        [`${props.contact}`]: arrayUnion({
          timestamp: new Date().toISOString(),
          type: 'post',
          postid: props.postId,
          postuserid: props.id,
          id: currentUser.uid,
        }),
      });
      setSending(false);
      setSent(true);
    };
    sendData();
  };

  return (
    <div className={`${classes.wrapper}`}>
      <span className={`${classes.dataSection}`}>
        <Avatar className={`${classes.avatar}`} src={props.src} />
        <p className={`${classes.username}`}>{props.username}</p>
      </span>
      <span className={`${classes.sendBtnSection}`}>
        {sending && (
          <CircularProgress className={`${classes.progress}`} size="1rem" />
        )}
        <button
          className={`${classes.sendBtn} ${sent ? classes.bgTransparent : ''}`}
          onClick={handleSendPost}
        >
          <p className={`${sending ? classes.dn : ''}`}>
            {sent ? 'Sent' : 'Send'}
          </p>
        </button>
      </span>
    </div>
  );
};

export default ShareModalContactBox;
