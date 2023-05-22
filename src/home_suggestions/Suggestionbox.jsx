import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import CostumeFollowBtn from '../components/CostumeFollowBtn';
import CustomeAvatar from '../components/CustomeAvatar';
import { db } from '../Firebase/firebase';

import classes from './SuggestionBox.module.css';
const Suggestionbox = (props) => {
  const [imgUrl, setImgUrl] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const ref = doc(db, 'users', props.id);

    const unSub = onSnapshot(ref, (docs) => {
      setImgUrl(docs.data().backgroundImg);
      setUsername(docs.data().username);
      setBio(docs.data().bio);
    });
  }, [props.id]);

  return (
    <div className={classes.container}>
      <CustomeAvatar
        dispalyUsername={true}
        userName={username}
        textProp={classes.username}
        displayBio={true}
        bio={bio}
        src={imgUrl}
      />
      <CostumeFollowBtn id={props.id} className={classes.followBtn}>
        Follow
      </CostumeFollowBtn>
    </div>
  );
};

export default Suggestionbox;
