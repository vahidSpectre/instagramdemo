import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

import { Settings } from '@mui/icons-material';
import { Avatar, IconButton, Modal } from '@mui/material';
import CostumeFollowBtn from '../components/CostumeFollowBtn';
import { useLocation } from 'react-router-dom';
import ExplorePost from '../explore/ExplorePost';
import classes from './Profile.module.css';
import SettingsModal from './SettingsModal';

const Profile = (props) => {
  const [id, setId] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [postsLength, setpostsLength] = useState(0);
  const [postsData, setPostsData] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const profilePostRef = useRef();
  const { currentUser } = useContext(AuthContext);

  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      setId(state.id);
      setRenderData([]);
    }
  }, [state]);

  const fetchData = async (id) => {
    const userDocRef = doc(db, 'users', id);
    const dataSnap = onSnapshot(userDocRef, (docs) => {
      const data = docs.data();
      setImgUrl(data.backgroundImg);
      setUsername(data.username);
      setBio(data.bio);
      setFollowers(Object.values(data.followers).length);
      setFollowing(Object.values(data.following).length - 1);
    });
  };
  const fetchPosts = async (id) => {
    const userpostsRef = doc(db, 'posts', id);
    const dataSnap = await getDoc(userpostsRef);
    if (dataSnap.exists()) {
      const data = dataSnap.data();
      if (data) {
        const dataLegth = Object.values(data).length;
        setpostsLength(dataLegth);
        for (let i = 0; i < dataLegth; i++) {
          setPostsData((dataa) => [...dataa, Object.values(data)[i]]);
        }
      }
    }
  };

  useEffect(() => {
    if (id) {
      setPostsData([]);
      fetchData(id);
      fetchPosts(id);
    }

    if (id !== currentUser.uid) {
      setShowSettings(false);
    } else setShowSettings(true);
  }, [id]);

  useEffect(() => {
    const removedDuplicates = postsData.reduce((unique, o) => {
      if (!unique.some((obj) => obj.imgUrl === o.imgUrl)) {
        unique.push(o);
      }
      return unique;
    }, []);

    const comFn = (a, b) => {
      if (a.timeLine > b.timeLine) {
        return -1;
      }
      if (a.timeLine < b.timeLine) {
        return 1;
      } else return;
    };
    setRenderData(Object.values(removedDuplicates).sort(comFn));
  }, [postsData]);

  const handleCloseModal = () => setOpenModal(false);
  return (
    <div className={`${classes.profile}`}>
      <Modal
        className={`${classes.modal}`}
        open={openModal}
        onClose={handleCloseModal}
        disableAutoFocus
      >
        <SettingsModal />
      </Modal>
      <div className={`${classes.profileHeader} ${classes.center}`}>
        <div className={`${classes.headerWrapper}`}>
          <div className={`${classes.profileHeaderContent}`}>
            <Avatar className={`${classes.avatar}`} src={`${imgUrl}`} />
          </div>
          <div
            className={`${classes.profileData} ${
              showSettings ? '' : `${classes.m15}`
            }`}
          >
            <div className={`${classes.nameSection}`}>
              <span className={`${classes.username}`}>{username}</span>{' '}
              {showSettings && (
                <div
                  className={`${classes.settings}`}
                  onClick={() => setOpenModal(true)}
                >
                  <IconButton>
                    <Settings />
                  </IconButton>
                </div>
              )}
              <span className={`${classes.bio}`}>{bio}</span>
            </div>
            <div className={`${classes.followerSection}`}>
              <span className={`${classes.followData}`}>
                {postsLength} Posts
              </span>
              <span className={`${classes.followData}`}>
                {followers} Followers
              </span>
              <span className={`${classes.followData}`}>
                {following} Following
              </span>
            </div>
            <center>
              {id && (
                <CostumeFollowBtn
                  className={`${classes.followBtn} ${
                    !showSettings ? '' : `${classes.displayNone}`
                  }`}
                  id={id}
                />
              )}
            </center>
          </div>
        </div>
      </div>
      <div className={`${classes.postsSection}`}>
        {renderData.map((elem, i) => {
          return (
            <ExplorePost
              className={classes.postContainer}
              postId={elem.id}
              id={id}
              src={elem.imgUrl}
              keyy={i}
              ref={profilePostRef}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
