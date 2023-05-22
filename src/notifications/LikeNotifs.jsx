import React, { useContext, useEffect, useState } from 'react';
import useDifference from '../hooks/useDifference';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

import { AuthContext } from '../context/AuthContext';

import { Avatar } from '@mui/material';
import classes from './LikeNotifs.module.css';
import { useNavigate } from 'react-router-dom';
import GoToPost from '../components/GoToPost';
const LikeNotifs = (props) => {
  const [profileImg, setProfileImg] = useState('');
  const [username, setUsername] = useState('');
  const [postImgUrl, setPostImgUrl] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const nav = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const ref = doc(db, 'users', props.id);
    const fetchData = async () => {
      const docs = await getDoc(ref);
      if (docs.exists()) {
        const data = docs.data();
        setProfileImg(data.backgroundImg);
        setUsername(data.username);
      }
    };
    fetchData();
  }, [props.id]);

  useEffect(() => {
    const ref = doc(db, 'posts', currentUser.uid);
    const fetchPostData = async () => {
      const docs = await getDoc(ref);
      if (docs.exists()) {
        setPostImgUrl(docs.data()[props.postId].imgUrl);
      }
    };
    fetchPostData();
  }, [props.postId]);

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
      <div className={`${classes.leftSide}`}>
        <Avatar className={`${classes.avatar}`} src={profileImg} />
        <span className={`${classes.textWrapper}`}>
          <p className={`${classes.notifText}`}>
            {username} {String(props.type).toLowerCase()}d your post
          </p>
          <p className={`${classes.time}`}>{timestamp}</p>
        </span>
      </div>
      <div className={`${classes.rightSide}`}>
        <img className={`${classes.postImg}`} src={postImgUrl} />
      </div>
    </div>
  );
};

export default LikeNotifs;
