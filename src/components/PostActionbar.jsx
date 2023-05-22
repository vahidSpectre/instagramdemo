import React, { useEffect, useState, useContext, useRef } from 'react';

import { AuthContext } from '../context/AuthContext';

import { ReactComponent as heart } from '../media/heart-492.svg';
import { ReactComponent as heartRed } from '../media/heart-431red.svg';
import { ReactComponent as comment } from '../media/instagram-comment-13416.svg';
import { ReactComponent as share } from '../media/instagram-share-13423.svg';
import { Bookmark, BookmarkBorder, Search } from '@mui/icons-material';
import { Input, InputAdornment, Modal, SvgIcon } from '@mui/material';

import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../Firebase/firebase';

import classes from './PostActionbar.module.css';
import ShareModalContactBox from './ShareModalContactBox';
const PostActionbar = (props) => {
  const [postId, setPostId] = useState('');
  const [id, setId] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [renderFollowing, setRenderFollowing] = useState(false);
  const [searched, setSearched] = useState('');
  const [searchedFollowing, setSearchedFollowing] = useState([]);

  const inputRef = useRef();

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (postId && id) {
      const bookmardRef = doc(db, 'users', currentUser.uid);
      const likeRef = doc(db, 'posts', id);
      const fetchData = async () => {
        const bDocs = await getDoc(bookmardRef);
        const lDocs = await getDoc(likeRef);
        if (bDocs.exists()) {
          Object.values(bDocs.data().savedposts).map((elem) => {
            if (postId === elem.postId) {
              return setIsBookmarked(true);
            } else {
              return setIsBookmarked(false);
            }
          });
        }
        if (lDocs.exists()) {
          Object.values(lDocs.data()[postId].likes).map((elem) => {
            if (currentUser.uid === elem) {
              return setIsLiked(true);
            } else {
              return setIsLiked(false);
            }
          });
        }
      };
      fetchData();
    }
  }, [postId, id]);

  useEffect(() => {
    setPostId(props.postId);
    setId(props.id);
  }, [props.postId, props.id]);

  const handleLikePost = async () => {
    const contactNotifRef = doc(db, 'userstate', id);
    setIsLiked(true);
    const ref = doc(db, 'posts', id);
    await updateDoc(ref, {
      [`${postId}.likes`]: arrayUnion(currentUser.uid),
    });
    await updateDoc(contactNotifRef, {
      notif: arrayUnion({
        type: 'LIKE',
        id: currentUser.uid,
        timestamp: new Date().toISOString(),
        postid: postId,
      }),
    });
  };
  const handleUnlikePost = async () => {
    const contactNotifRef = doc(db, 'userstate', id);
    setIsLiked(false);
    const ref = doc(db, 'posts', id);
    await updateDoc(ref, {
      [`${postId}.likes`]: arrayRemove(currentUser.uid),
    });
    await updateDoc(contactNotifRef, {
      notif: arrayUnion({
        type: 'DISLIKE',
        id: currentUser.uid,
        timestamp: new Date().toISOString(),
        postid: postId,
      }),
    });
  };
  const handleSavePost = async () => {
    setIsBookmarked(true);

    const ref = doc(db, 'users', currentUser.uid);
    await updateDoc(ref, {
      savedposts: arrayUnion({ postId, id }),
    });
  };
  const handleUnsavePost = async () => {
    setIsBookmarked(false);

    const ref = doc(db, 'users', currentUser.uid);
    await updateDoc(ref, {
      savedposts: arrayRemove({ postId, id }),
    });
  };

  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const ref = doc(db, 'users', currentUser.uid);
    const unSub = onSnapshot(ref, (doc) => {
      setFollowing(doc.data().following);
    });
  }, []);

  useEffect(() => {
    setFollowingData([]);
    setRenderFollowing(false);
    setSearchedFollowing([]);

    const fetchData = async (id) => {
      const ref = doc(db, 'users', id);
      const docs = await getDoc(ref);
      if (docs.exists()) {
        const tempData = docs.data();
        setFollowingData((data) => [
          ...data,
          {
            imgUrl: tempData.backgroundImg,
            username: tempData.username,
            id: id,
          },
        ]);
      }
    };

    if (openModal === true && following.length !== 0) {
      following.map((elem) => {
        fetchData(elem);
      });
    }
  }, [openModal, following]);

  useEffect(() => {
    if (followingData) {
      const index = followingData.indexOf(`${currentUser.uid}`);
      followingData.splice(index, 1);
      setTimeout(() => {
        setRenderFollowing(true);
      }, 1);
    }
  }, [followingData]);

  useEffect(() => {
    setSearchedFollowing([]);
    setRenderFollowing(false);
    if (searched !== '' && followingData.length > 0) {
      followingData.map((elem) => {
        if (String(elem.username) === searched) {
          return setSearchedFollowing(elem);
        } else {
          setSearchedFollowing([]);
        }
      });
    }
  }, [searched]);

  useEffect(() => {
    if (searchedFollowing.length !== 0) {
      setTimeout(() => {
        setRenderFollowing(true);
      }, 1);
    }
  }, [searchedFollowing]);

  return (
    <div className={`${classes.actionContainer} ${props.class}`}>
      <Modal
        className={`${classes.modal} ${classes.center}`}
        open={openModal}
        onClose={handleCloseModal}
      >
        <div className={`${classes.modalContainer}`}>
          <div className={`${classes.searchContactsSection}`}>
            <p>Search followings</p>
            <Input
              className={`${classes.searchInput}`}
              type="text"
              ref={inputRef}
              placeholder={'contacts...'}
              onChange={(e) => {
                setSearched(e.target.value);
              }}
              disableUnderline
              endAdornment={
                <InputAdornment position="end">
                  <Search className={`${classes.inputAdornment}`} />
                </InputAdornment>
              }
            ></Input>
          </div>
          <div className={`${classes.followingWrapper}`}>
            {
              searchedFollowing.length === 0 &&
                renderFollowing &&
                followingData.map((elem) => {
                  return (
                    <ShareModalContactBox
                      src={elem.imgUrl}
                      username={elem.username}
                      id={props.id}
                      contact={elem.id}
                      postId={postId}
                    />
                  );
                })
              // : (
              //   <ShareModalContactBox
              //     src={searchedFollowing.imgUrl}
              //     username={searchedFollowing.username}
              //     id={searchedFollowing.id}
              //   />
              // )
            }
          </div>
        </div>
      </Modal>
      <div className={classes.leftactions}>
        {isLiked ? (
          <button
            onClick={handleUnlikePost}
            className={`${classes.actionBtn} ${classes.center}`}
          >
            <SvgIcon component={heartRed} viewBox="0 0 300 300" />
          </button>
        ) : (
          <button
            onClick={handleLikePost}
            className={`${classes.actionBtn} ${classes.center} ${classes.hover}`}
          >
            <SvgIcon component={heart} viewBox="0 0 300 300" />
          </button>
        )}
        <button
          className={`${classes.actionBtn} ${classes.center} ${classes.hover}`}
          onClick={props.comments}
        >
          <SvgIcon component={comment} viewBox="0 0 300 300" />
        </button>
        <button
          className={`${classes.actionBtn} ${classes.center} ${classes.hover}`}
          onClick={() => setOpenModal(true)}
        >
          <SvgIcon component={share} viewBox="0 0 300 300" />
        </button>
      </div>
      <div className={classes.bookmarkcontainer}>
        {isBookmarked ? (
          <button
            className={`${classes.bookmarkBtn}`}
            onClick={handleUnsavePost}
          >
            <Bookmark />
          </button>
        ) : (
          <button
            className={`${classes.bookmarkBtn} ${classes.hover}`}
            onClick={handleSavePost}
          >
            <BookmarkBorder />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostActionbar;
