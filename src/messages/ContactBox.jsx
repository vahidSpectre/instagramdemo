import React, { useContext, useEffect, useState } from 'react';

import { Avatar } from '@mui/material';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

import { AuthContext } from '../context/AuthContext';

import classes from './ContactBox.module.css';
const ContactBox = (props) => {
  const [username, setUsername] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (props.id) {
      const ref = doc(db, 'users', props.id);
      const fetchData = async () => {
        const docs = await getDoc(ref);
        if (docs.exists()) {
          setUsername(docs.data().username);
          setImgUrl(docs.data().backgroundImg);
        }
      };
      fetchData();
    }
  }, [props.id]);

  const updateDocContact = async () => {
    const refContact = doc(db, 'messages', props.id);
    await updateDoc(refContact, {
      [`${currentUser.uid}`]: [],
    });
  };
  const handleLiftStats = () => {
    props.liftData(username, props.id, imgUrl);
    const refContact = doc(db, 'messages', props.id);

    const checkData = async () => {
      const docContact = await getDoc(refContact);
      if (docContact.exists()) {
        const data = docContact.data();
        const e = Object.keys(data).indexOf(currentUser.uid, 0);

        if (Object.keys(data).length !== 0) {
          if (e === -1) {
            return updateDocContact();
          } else {
            return '';
          }
        } else {
          updateDocContact();
        }
      }
    };
    checkData();
  };

  return (
    <div
      key={props.keyy}
      className={`${classes.wrapper}`}
      onClick={handleLiftStats}
    >
      <Avatar className={`${classes.avatar}`} src={imgUrl} />
      <div className={`${classes.username}`}>{username}</div>
    </div>
  );
};

export default ContactBox;
