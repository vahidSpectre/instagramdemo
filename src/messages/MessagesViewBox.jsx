import React, { useContext, useEffect, useRef, useState } from 'react';

import { doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { db } from '../Firebase/firebase';

import classes from './MessagesViewBox.module.css';

import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import PostMessage from './PostMessage';
const MessagesViewBox = (props) => {
  const [contactMessages, setContactMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [tempMessages, setTempMessages] = useState([]);
  const [messages, setMessages] = useState([]);

  const { currentUser } = useContext(AuthContext);

  const messageBox = useRef();

  useEffect(() => {
    setMessages([]);
    if (props.id) {
      const ref = doc(db, 'messages', props.id);
      const unsub = onSnapshot(ref, (doc) => {
        setContactMessages(doc.data()[currentUser.uid]);
      });
    }
  }, [props.id]);

  useEffect(() => {
    const ref = doc(db, 'messages', currentUser.uid);
    if (props.id) {
      const unsub = onSnapshot(ref, (doc) => {
        setUserMessages(doc.data()[props.id]);
      });
    }
  }, [props.id]);

  const compFn = (a, b) => {
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    if (a.timestamp < b.timestamp) {
      return -1;
    } else {
      return;
    }
  };
  useEffect(() => {
    if (userMessages && contactMessages) {
      setTempMessages([...contactMessages, ...userMessages]);
    }
  }, [contactMessages, userMessages]);

  const scrollIntoView = () => {
    setTimeout(() => {
      messageBox.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 0);
  };

  useEffect(() => {
    setMessages(tempMessages.sort(compFn));
    scrollIntoView();
  }, [tempMessages]);

  return (
    <div className={`${classes.wrapper} ${props.className}`}>
      {messages.map((elem, i) => {
        if (elem.type === 'text') {
          if (elem.id === currentUser.uid) {
            return (
              <TextMessage
                message={elem.message}
                timestamp={elem.timestamps}
                keyy={i}
                ref={messageBox}
                user={true}
              />
            );
          }
          if (elem.id === props.id) {
            return (
              <TextMessage
                message={elem.message}
                timestamp={elem.timestamps}
                keyy={i}
                ref={messageBox}
                user={false}
              />
            );
          }
        }
        if (elem.type === 'photo') {
          if (elem.id === currentUser.uid) {
            return (
              <ImageMessage
                src={elem.message}
                timestamp={elem.timestamps}
                keyy={i}
                ref={messageBox}
                user={true}
              />
            );
          }
          if (elem.id === props.id) {
            return (
              <ImageMessage
                src={elem.message}
                timestamp={elem.timestamps}
                keyy={i}
                ref={messageBox}
                user={false}
              />
            );
          }
        }
        if (elem.type === 'post') {
          if (elem.id === currentUser.uid) {
            return (
              <PostMessage
                postId={elem.postid}
                userId={elem.postuserid}
                timestamp={elem.timestamps}
                keyy={i}
                ref={messageBox}
                user={true}
              />
            );
          }
          if (elem.id === props.id) {
            return (
              <PostMessage
                postId={elem.postid}
                userId={elem.postuserid}
                timestamp={elem.timestamps}
                keyy={i}
                ref={messageBox}
                user={false}
              />
            );
          }
        }
      })}
    </div>
  );
};

export default MessagesViewBox;
