import React, { useState, useContext, useEffect } from 'react';
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import { AuthContext } from '../context/AuthContext';

import classes from './CostumeFollowBtn.module.css';
const CostumeFollowBtn = (props) => {
  const [following, setFollowing] = useState(false);
  const [data, setData] = useState('');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
      setData(doc.data());
    });
    return unsub;
  }, []);

  useEffect(() => {
    setFollowing(false);
    if (data) {
      Object.values(data?.following).map((elem) => {
        if (elem === props.id) {
          return setFollowing(true);
        }
      });
    }
  }, [data, props.id]);

  const handleFollowAccount = async () => {
    const followAccountRef = doc(db, 'users', currentUser.uid);
    const followAccountRefContact = doc(db, 'users', props?.id);
    const notifRefContact = doc(db, 'userstate', props?.id);
    //update user following
    if (following === false) {
      setFollowing(true);
      await updateDoc(followAccountRef, {
        following: arrayUnion(`${props.id}`),
      });
      await updateDoc(followAccountRefContact, {
        followers: arrayUnion(`${currentUser.uid}`),
      });
      await updateDoc(notifRefContact, {
        notif: arrayUnion({
          id: currentUser.uid,
          type: 'FOLLOW',
          timestamp: new Date().toISOString(),
        }),
      });
    }
    if (following === true) {
      setFollowing(false);
      await updateDoc(followAccountRef, {
        following: arrayRemove(`${props.id}`),
      });
      await updateDoc(followAccountRefContact, {
        followers: arrayRemove(`${currentUser.uid}`),
      });
      await updateDoc(notifRefContact, {
        notif: arrayUnion({
          id: currentUser.uid,
          type: 'UNFOLLOW',
          timestamp: new Date().toISOString(),
        }),
      });
    }
  };

  return (
    <button
      className={`${classes.followBtn} ${following ? classes.textBlack : ''} ${
        !following ? classes.bg : ''
      } ${props.className}`}
      onClick={handleFollowAccount}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
};

export default CostumeFollowBtn;
