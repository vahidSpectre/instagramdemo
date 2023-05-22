import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../Firebase/firebase';
import classes from './Stories.module.css';
import StoryContainer from './StoryContainer';

const Stories = () => {
  let [pos, setPos] = useState(0);
  const [nextBtnDn, setNextBtnDn] = useState(false);
  const [PreBtnDn, setPreBtnDn] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [userData, setUserData] = useState({ username: '', imgUrl: '' });

  const storiesContainer = useRef();
  const storiesSheet = useRef();

  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const ref = doc(db, 'users', currentUser.uid);
    const unSub = onSnapshot(ref, (docs) => {
      setFollowings(docs.data().following);
      setUserData({
        username: docs.data().username,
        imgUrl: docs.data().backgroundImg,
      });
    });
  }, []);

  useEffect(() => {
    setFollowingsData([]);
    if (followings) {
      followings.map((elem) => {
        if (elem !== currentUser.uid) {
          const ref = doc(db, 'users', elem);
          const unSub = onSnapshot(ref, (docs) => {
            const tempData = docs.data();
            setFollowingsData((data) => [
              ...data,
              {
                id: elem,
                imgUrl: tempData.backgroundImg,
                username: tempData.username,
              },
            ]);
          });
        }
      });
    }
  }, [followings]);

  useEffect(() => {
    storiesContainer.current.scrollLeft = pos;

    if (
      storiesSheet.current.clientWidth > storiesContainer.current.clientWidth
    ) {
      if (pos === 0) {
        setPreBtnDn(true);
        setNextBtnDn(false);
      } else if (
        pos >
        storiesSheet.current.clientWidth - storiesContainer.current.clientWidth
      ) {
        setNextBtnDn(true);
        setPreBtnDn(false);
      } else {
        setNextBtnDn(false);
        setPreBtnDn(false);
      }
    } else {
      setNextBtnDn(true);
      setPreBtnDn(true);
    }
  }, [pos]);

  const scrollForward = () => {
    if (
      pos <
      storiesSheet.current.clientWidth - storiesContainer.current.clientWidth
    ) {
      setPos(() => pos + 295);
    }
  };
  const scrollBackward = () => {
    if (pos > 0) {
      setPos(() => pos - 295);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.container} ref={storiesContainer}>
        <button
          className={`${classes.storyBtn} ${classes.btnPre} ${classes.center} ${
            PreBtnDn && classes.dn
          }`}
          onClick={scrollBackward}
        >
          <ArrowBackIos className={classes.arrow} />
        </button>
        <div className={classes.storySheet} ref={storiesSheet}>
          <StoryContainer
            id={currentUser.uid}
            imgUrl={userData.imgUrl}
            username={userData.username}
          />
          {followingsData.map((elem) => {
            return (
              <StoryContainer
                id={elem.id}
                imgUrl={elem.imgUrl}
                username={elem.username}
              />
            );
          })}
        </div>
        <button
          className={`${classes.storyBtn} ${classes.btnNext} ${
            classes.center
          } ${nextBtnDn && classes.dn}`}
          onClick={scrollForward}
        >
          <ArrowForwardIos className={classes.arrow} />
        </button>
      </div>
    </div>
  );
};

export default Stories;
