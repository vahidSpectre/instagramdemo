import React, { useContext, useEffect, useRef, useState } from 'react';

import useDifference from '../hooks/useDifference';

import { AuthContext } from '../context/AuthContext';

import { EmojiEmotionsOutlined } from '@mui/icons-material';
import {
  Avatar,
  Input,
  InputAdornment,
  Modal,
  Typography,
} from '@mui/material';

import Comments from './Comments';
import PostActionbar from './PostActionbar';
import PostHeader from './PostHeader';

import classes from './GoToPost.module.css';
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../Firebase/firebase';
const GoToPost = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [totalLikes, setTotalLikes] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentMemo, setCommentMemo] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [username, setUsername] = useState('');

  const modalInput = useRef();
  const { currentUser } = useContext(AuthContext);

  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    if (props.open === true) {
      setOpenModal(props.open);
    }
  }, [props.open]);

  useEffect(() => {
    if (props.postId && props.id) {
      const ref = doc(db, 'posts', props.id);
      const refUser = doc(db, 'users', props.id);
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
  }, [props.postId, props.id]);

  const timestamp = useDifference(data?.timeLine);

  useEffect(() => {
    const ref = doc(db, 'posts', `${props?.id}`);
    const unSub = onSnapshot(ref, (doc) => {
      setTotalLikes(Object.values(doc.data()[props.postId]?.likes)?.length);
    });
  }, [openModal]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentMemo.trim(' ') !== '') {
      setNewComment(commentMemo);
    }
    if (modalInput.current) {
      modalInput.current.value = '';
    }
  };

  useEffect(() => {
    if (newComment !== '') {
      const addComment = async (com) => {
        const commentRef = doc(db, 'comments', props.id);
        await updateDoc(commentRef, {
          [`${props.postId}`]: arrayUnion({
            comment: com,
            timestamp: new Date().toISOString(),
            likes: 0,
            commentId: currentUser.uid,
          }),
        });
      };
      addComment(newComment);
    }
  }, [newComment]);

  useEffect(() => {
    if (openModal === false) {
      props.onClose(false);
    }
  }, [openModal]);

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      className={`${classes.modal}`}
      disableAutoFocus
      key={props.keyy}
    >
      <div className={`${classes.modalContainer}`}>
        <section className={`${classes.modalImgSection}`}>
          <img className={`${classes.modalImg}`} src={data?.imgUrl} alt="" />
        </section>
        <section className={`${classes.dataSection}`}>
          <PostHeader
            className={`${classes.modalHeader}`}
            userName={username}
            src={profileImg}
          />
          <div className={`${classes.modalCaptionSection}`}>
            <Avatar className={`${classes.modalAvatar}`} src={profileImg} />
            <p className={`${classes.username}`}>{username}</p>
            <p className={`${classes.modalCaption}`}>{data?.caption}</p>
          </div>
          <Comments id={props.id} postId={props.postId} />
          <div className={`${classes.action}`}>
            <PostActionbar
              postId={props?.postId}
              id={props?.id}
              class={classes.p1}
            />
            <Typography variant="body2" className={`${classes.totalLikes}`}>
              {totalLikes} Likes
            </Typography>
            <Typography variant="body2" className={`${classes.timestamp}`}>
              {timestamp}
            </Typography>
          </div>
          <form onSubmit={handleSubmitComment}>
            <Input
              size="small"
              variant="standard"
              placeholder="Add a comment..."
              inputRef={modalInput}
              className={classes.form}
              disableUnderline
              inputProps={{
                style: {
                  marginBottom: '1rem',
                  transition: 'none',
                  width: '100%',
                },
              }}
              sx={{ position: 'absolute', bottom: '0', width: '100%' }}
              onChange={(e) => setCommentMemo(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <EmojiEmotionsOutlined className={classes.emojiBtnM} />
                </InputAdornment>
              }
            />
          </form>
        </section>
      </div>
    </Modal>
  );
};

export default GoToPost;
