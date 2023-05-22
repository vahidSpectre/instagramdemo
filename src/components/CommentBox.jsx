import React, { useEffect, useState } from 'react';

import classes from './CommentBox.module.css';
import CustomeAvatar from './CustomeAvatar';

import { ReactComponent as heart } from '../media/heart-492.svg';
import { ReactComponent as heartRed } from '../media/heart-431red.svg';
import { SvgIcon } from '@mui/material';
import useDifference from '../hooks/useDifference';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

const CommentBox = (props) => {
  const [imgUrl, setImgUrl] = useState('');
  const [username, setUsername] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [totalLikes, setTotalLikes] = useState(2);
  const [isCommentLiked, setIsCommentLiked] = useState(false);

  const time = useDifference(props.timestamp);
  const ref = doc(db, 'users', props.id);
  useEffect(() => {
    setTimestamp(time);
    const fetchData = async () => {
      const docs = await getDoc(ref);
      if (docs.exists()) {
        setImgUrl(docs.data().backgroundImg);
        setUsername(docs.data().username);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isCommentLiked) {
      setTotalLikes(totalLikes + 1);
    } else {
      setTotalLikes(totalLikes - 1);
    }
  }, [isCommentLiked]);

  return (
    <div className={classes.container} key={props.keyy}>
      <CustomeAvatar
        class={classes.avatarM}
        src={imgUrl}
        dispalyUsername={true}
        userName={username}
        active={true}
        boldText={true}
      />
      <p className={classes.comment}>
        {props.comment}
        <span className={classes.infoContainer}>
          <span className={classes.timestamp}>{timestamp}</span>
          <span className={classes.totalLikes}>
            {`${totalLikes} ${totalLikes > 1 ? 'likes' : 'like'}`}
          </span>
        </span>
      </p>
      <div className={classes.likeContainer}>
        {isCommentLiked ? (
          <button
            className={classes.commentLikeBtn}
            onClick={() => setIsCommentLiked(!isCommentLiked)}
          >
            <SvgIcon component={heartRed} viewBox="0 0 400 400" />
          </button>
        ) : (
          <button
            className={classes.commentLikeBtn}
            onClick={() => setIsCommentLiked(!isCommentLiked)}
          >
            <SvgIcon component={heart} viewBox="0 0 400 400" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
