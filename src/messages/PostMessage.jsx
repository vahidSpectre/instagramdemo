import React, { forwardRef, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../Firebase/firebase';

import { Avatar, Skeleton } from '@mui/material';
import GoToPost from '../components/GoToPost';

import classes from './PostMessage.module.css';
const PostMessage = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [profileImg, setProfileImg] = useState('');
  const [username, setUsername] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = (a) => setOpenModal(a);

  useEffect(() => {
    if (props.postId && props.userId) {
      const ref = doc(db, 'posts', props.userId);
      const refUser = doc(db, 'users', props.userId);
      const fetchData = async () => {
        const docsInfo = await getDoc(refUser);
        const docs = await getDoc(ref);
        if (docs.exists()) {
          setData(docs.data()[`${props.postId}`]);
        }
        if (docsInfo.exists()) {
          setProfileImg(docsInfo.data().backgroundImg);
          setUsername(docsInfo.data().username);
        }
      };
      fetchData();
    }
  }, [props.postId, props.userId]);

  return (
    <div
      key={props.keyy}
      ref={ref}
      className={`${classes.wrapper} ${props.user ? classes.user : ''}`}
    >
      <GoToPost
        open={openModal}
        onClose={handleCloseModal}
        id={props.userId}
        postId={props.postId}
      />

      <div className={`${classes.header}`}>
        <Avatar className={`${classes.avatar}`} src={profileImg} />
        {username ? (
          <p className={`${classes.username}`}>{username}</p>
        ) : (
          <Skeleton
            animation="wave"
            variant="text"
            className={classes.usernameSkeleton}
          />
        )}
      </div>

      {data.imgUrl ? (
        <div
          className={`${classes.imgSection}`}
          onClick={() => setOpenModal(true)}
        >
          <img className={`${classes.img}`} src={data.imgUrl} alt="" />
        </div>
      ) : (
        <Skeleton
          animation="wave"
          variant="rectangular"
          className={`${classes.imgcontainerSkeleton}`}
        />
      )}

      <div className={`${classes.captionSection}`}>
        {username ? (
          <p className={`${classes.username}`}>{username}</p>
        ) : (
          <Skeleton
            animation="wave"
            variant="text"
            className={`${classes.usernameSkeleton}`}
          />
        )}
        {data.caption ? (
          <p className={`${classes.caption}`}>{data.caption}</p>
        ) : (
          <Skeleton
            animation="wave"
            variant="text"
            className={`${classes.captionSkeleton}`}
          />
        )}
      </div>
    </div>
  );
});

export default PostMessage;
