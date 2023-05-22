import React, {
  useState,
  useRef,
  useEffect,
  memo,
  forwardRef,
  useContext,
} from 'react';
import { EmojiEmotionsOutlined } from '@mui/icons-material';
import {
  Input,
  InputAdornment,
  Modal,
  Skeleton,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import classes from './Post.module.css';
import PostHeader from './PostHeader';
import PostActionbar from './PostActionbar';
import CustomeAvatar from './CustomeAvatar';
import Comments from './Comments';

import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../Firebase/firebase';

import { AuthContext } from '../context/AuthContext';

import useDifference from '../hooks/useDifference';
const Post = forwardRef((props, ref) => {
  const [isBookMark, setIsBookMark] = useState(false);
  const [commnetsCount, setCommnetsCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [userName, setUserName] = useState('');
  const [profileImg, setprofileImg] = useState('');
  const [fullCaption, setFullCaption] = useState(false);
  const [modalContainer, setModalContainer] = useState(false);
  const [timestamp, setTimstamp] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentMemo, setCommentMemo] = useState('');
  const [loadingPostImg, setloadingPostImg] = useState(true);

  const modalInput = useRef();
  const postInput = useRef();

  const { currentUser } = useContext(AuthContext);

  const commentsRef = doc(db, 'comments', `${props.id}`);

  const handleCloseModal = () => setModalContainer(false);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentMemo.trim(' ') !== '') {
      setNewComment(commentMemo);
    }
    if (postInput.current) {
      postInput.current.value = '';
    }
    if (modalInput.current) {
      modalInput.current.value = '';
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const docs = onSnapshot(commentsRef, (doc) => {
        setCommnetsCount(Object.values(doc.data()[`${props.postId}`]).length);
      });
    };
    fetchComments();
  }, []);

  useEffect(() => {
    const ref = doc(db, 'users', props.id);
    const fetchData = async () => {
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        setUserName(docSnap.data().username);
        setprofileImg(docSnap.data().backgroundImg);
      } else {
        console.log('No such document!');
      }
    };
    fetchData();
    const likeRef = doc(db, 'posts', props?.id);
    const unSubLike = onSnapshot(likeRef, (doc) => {
      setTotalLikes(Object.values(doc.data()[props.postId].likes).length);
    });
  }, [props.id, props.postId]);

  var time = useDifference(props.timestamp);
  useEffect(() => {
    setTimstamp(time);
  }, [time]);

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

  return (
    <div key={props.keyy} ref={ref}>
      <Modal
        open={modalContainer}
        onClose={handleCloseModal}
        className={classes.center}
      >
        <Box className={classes.profileModalContainer}>
          <div className={`${classes.postSection} ${classes.center}`}>
            <div
              className={classes.imgContainer}
              style={{ maxHeight: '90vh', margin: '0', padding: '0' }}
            >
              <img className={classes.img} src={props.img} alt="" />
            </div>
          </div>
          <div className={`${classes.dataSection} `}>
            <PostHeader
              className={`${classes.modalHeader}`}
              bookmark={() => setIsBookMark(isBookMark ? false : true)}
              bookmarked={isBookMark}
              userName={userName}
              src={profileImg}
              id={props.id}

            />
            <div className={`${classes.modalCaptionSpancon}`}>
              <div className={`${classes.captionContainer}`}>
                <div className={`${classes.caption} ${classes.devider}`}>
                  <span
                    className={classes.captionText}
                    style={{
                      width: '100%',
                      display: 'flex',
                    }}
                  >
                    <CustomeAvatar
                      class={classes.modalCapionAvatar}
                      dispalyUsername={false}
                      src={profileImg}
                      id={props.id}
                    />
                    <span
                      className={`${classes.modalCaptionSpan}`}
                      style={{ lineHeight: '1.7rem' }}
                    >
                      <strong className={`${classes.captionUsername} `}>
                        {userName}
                      </strong>
                      {props.caption}
                    </span>
                  </span>
                </div>
                <Comments id={props.id} postId={props.postId} />
              </div>
            </div>
            <PostActionbar
              postId={props?.postId}
              id={props?.id}
              class={classes.p1}
            />
            <Typography
              className={`${classes.totallikes} ${classes.p1} ${classes.pt1}`}
              variant="body2"
            >
              {totalLikes <= 1 ? `${totalLikes} like` : `${totalLikes} likes`}
            </Typography>
            <Typography
              className={`${classes.postedtime} ${classes.p1} ${classes.devider} ${classes.mb1}`}
              variant="body2"
            >
              {timestamp}
            </Typography>
            <form onSubmit={handleSubmitComment}>
              <Input
                size="small"
                variant="standard"
                placeholder="Add a comment..."
                className={classes.mt}
                inputRef={modalInput}
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
          </div>
        </Box>
      </Modal>

      <div className={`${classes.postcontainer}`} ref={props.reff}>
        <PostHeader
          bookmark={() => setIsBookMark(isBookMark ? false : true)}
          bookmarked={isBookMark}
          userName={userName}
          src={profileImg}
        />
        <div className={classes.imgContainer}>
          {loadingPostImg && (
            <Skeleton variant="rectangular" className={classes.imgContainer} />
          )}

          <img
            className={classes.img}
            src={props.img}
            onLoad={() => setloadingPostImg(false)}
            alt=""
          />
        </div>
        <PostActionbar
          postId={props.postId}
          id={props.id}
          comments={() => setModalContainer(true)}
        />
        <Typography className={classes.totallikes} variant="body2">
          {totalLikes <= 1 ? `${totalLikes} like` : `${totalLikes} likes`}
        </Typography>
        <div className={classes.caption}>
          <p
            className={`${classes.captionText} ${classes.mt5}`}
            style={{
              whiteSpace: `${fullCaption ? 'normal' : 'nowrap'}`,
            }}
          >
            <strong className={classes.captionUsername}>{userName}</strong>
            {props.caption}
            <button
              className={`${classes.captionMore} ${classes.default}`}
              onClick={() => setFullCaption(fullCaption ? false : true)}
              style={{
                display: `${fullCaption ? 'block' : 'none'}`,
              }}
            >
              show less
            </button>
          </p>
          <button
            className={`${classes.captionMore} ${classes.default}`}
            onClick={() => setFullCaption(fullCaption ? false : true)}
            style={{
              display: `${fullCaption ? 'none' : 'block'}`,
              marginTop: '.5rem',
            }}
          >
            more
          </button>
        </div>
        <button
          className={`${classes.captionMore} ${classes.default}`}
          onClick={() => setModalContainer(true)}
        >
          Show all {commnetsCount} comments
        </button>
        <div className={`${classes.postedtime}`}>{timestamp}</div>
        <form onSubmit={handleSubmitComment}>
          <Input
            size="small"
            variant="standard"
            placeholder="Add a comment..."
            className={classes.mt}
            inputRef={postInput}
            inputProps={{
              style: {
                marginBottom: '1rem',
                transition: 'none',
              },
            }}
            style={{ width: '100%' }}
            onChange={(e) => setCommentMemo(e.target.value)}
            tabIndex={0}
            endAdornment={
              <InputAdornment position="end">
                <EmojiEmotionsOutlined className={classes.emojiBtn} />
              </InputAdornment>
            }
          />
        </form>
      </div>
    </div>
  );
});

export default memo(Post);
