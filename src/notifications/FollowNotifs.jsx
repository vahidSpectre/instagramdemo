import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

import classes from './FollowNotifs.module.css';
import { Avatar } from '@mui/material';
import useDifference from '../hooks/useDifference';
const FollowNotifs = (props) => {
  const [username, setUsername] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const nav = useNavigate();

  useEffect(() => {
    const ref = doc(db, 'users', props.id);
    const fetchData = async () => {
      const docs = await getDoc(ref);
      if (docs.exists()) {
        setProfileImg(docs.data().backgroundImg);
        setUsername(docs.data().username);
      }
    };
    fetchData();
  }, [props.id]);

  const time = useDifference(props.timestamp);

  useEffect(() => {
    setTimestamp(time);
  }, [props.timestamp]);

  const hanldeGoToProfile = () => {
    nav('/profile', { state: { id: props.id } });
  };

  return (
    <div
      key={props.keyy}
      className={`${classes.wrapper}`}
      onClick={hanldeGoToProfile}
    >
      <Avatar className={`${classes.avatar}`} src={profileImg} />
      <span className={`${classes.textWrapper}`}>
        <p className={`${classes.notifText}`}>
          {props.type === 'FOLLOW'
            ? `${username} started following you`
            : `${username} unfollowed you`}
        </p>
        <p className={`${classes.time}`}>{timestamp}</p>
      </span>
    </div>
  );
};

export default FollowNotifs;
