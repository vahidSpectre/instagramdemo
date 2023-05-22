import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

import {
  ArrowBack,
  Block,
  Bookmarks,
  CallMissed,
  East,
} from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Modal,
  Typography,
} from '@mui/material';

import classes from './ProfileSettingsActions.module.css';
import ExplorePost from '../explore/ExplorePost';
import SearchResultContainer from '../components/SearchResultContainer';
const ProfileSettingsActions = () => {
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [savedPostsData, setSavedPostsData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [blockedData, setBlockedData] = useState([]);
  const [modalSelected, setModalSelected] = useState({
    bookmarks: false,
    following: false,
    followers: false,
    blocked: false,
  });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const ref = doc(db, 'users', currentUser.uid);
    const unsub = onSnapshot(ref, (docs) => {
      setFollowers(docs.data().followers);
      setFollowings(docs.data().following);
      setBlocked(docs.data().blocked);
      setBookmarked(docs.data().savedposts);
    });
  }, []);

  useEffect(() => {
    if (modalSelected.bookmarks === true) {
      setSavedPostsData([]);
      const fetchData = async (id, postId) => {
        const ref = doc(db, 'posts', id);
        const docs = await getDoc(ref);

        if (docs.exists()) {
          const tempData = docs.data()[postId];
          setSavedPostsData((data) => [
            ...data,
            {
              caption: tempData.caption,
              id: docs.id,
              postId: postId,
              imgUrl: tempData.imgUrl,
            },
          ]);
        }
      };
      bookmarked.map((elem) => {
        fetchData(elem.id, elem.postId);
      });
    }
    if (modalSelected.followers === true) {
      setFollowersData([]);
      const fetchData = async (acc) => {
        const ref = doc(db, 'users', acc);
        const docs = await getDoc(ref);
        if (docs.exists()) {
          const tempData = docs.data();
          if (docs.id !== currentUser.uid) {
            setFollowersData((data) => [
              ...data,
              {
                username: tempData.username,
                imgUrl: tempData.backgroundImg,
                id: docs.id,
              },
            ]);
          }
        }
      };
      followers.map((elem) => {
        fetchData(elem);
      });
    }
    if (modalSelected.following === true) {
      setFollowingsData([]);
      const fetchData = async (acc) => {
        const ref = doc(db, 'users', acc);
        const docs = await getDoc(ref);
        if (docs.exists()) {
          const tempData = docs.data();
          if (docs.id !== currentUser.uid) {
            setFollowingsData((data) => [
              ...data,
              {
                username: tempData.username,
                imgUrl: tempData.backgroundImg,
                id: docs.id,
              },
            ]);
          }
        }
      };
      followings.map((elem) => {
        fetchData(elem);
      });
    }
    if (modalSelected.blocked === true) {
      setFollowingsData([]);
      const fetchData = async (acc) => {
        const ref = doc(db, 'users', acc);
        const docs = await getDoc(ref);
        if (docs.exists()) {
          const tempData = docs.data();
          if (docs.id !== currentUser.uid) {
            setBlockedData((data) => [
              ...data,
              {
                username: tempData.username,
                imgUrl: tempData.backgroundImg,
                id: docs.id,
              },
            ]);
          }
        }
      };
      blocked.map((elem) => {
        setBlockedData(elem);
      });
    }
  }, [modalSelected]);

  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className={`${classes.wrapper}`}>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className={`${classes.modal}`}
        sx={{ transition: 'all 1s' }}
        closeAfterTransition="true"
      >
        <div className={`${classes.modalContainer} `}>
          <IconButton
            className={`${classes.modalBackBtn}`}
            onClick={() => setOpenModal(false)}
          >
            <ArrowBack />
          </IconButton>
          {modalSelected.bookmarks && (
            <>
              <span className={`${classes.settingsActionTitle}`}>
                Bookmarked Posts
              </span>
              <div className={`${classes.modalBookmarkedPostsCon}`}>
                {savedPostsData.length !== 0 ? (
                  savedPostsData.map((elem, i) => {
                    console.log(elem);
                    return (
                      <ExplorePost
                        className={classes.modalBookmarkedPosts}
                        id={elem.id}
                        postId={elem.postId}
                        src={elem.imgUrl}
                        keyy={i}
                      />
                    );
                  })
                ) : (
                  <div className={`${classes.notFountText}`}>
                    You have no bookmarks!
                  </div>
                )}
              </div>
            </>
          )}
          {modalSelected.followers && (
            <>
              <span className={`${classes.settingsActionTitle}`}>
                Followers
              </span>
              {followersData.length !== 0 ? (
                followersData.map((elem) => {
                  return (
                    <SearchResultContainer
                      src={elem.imgUrl}
                      username={elem.username}
                      id={elem.id}
                    />
                  );
                })
              ) : (
                <div className={`${classes.notFountText}`}>
                  You have no followers yet!
                </div>
              )}
            </>
          )}
          {modalSelected.following && (
            <>
              <span className={`${classes.settingsActionTitle}`}>
                Followings
              </span>
              {followingsData.length !== 0 ? (
                followingsData.map((elem) => {
                  return (
                    <SearchResultContainer
                      src={elem.imgUrl}
                      username={elem.username}
                      id={elem.id}
                    />
                  );
                })
              ) : (
                <div className={`${classes.notFountText}`}>
                  You are not following anyone dum what should I show YOU?
                </div>
              )}
            </>
          )}
          {modalSelected.blocked && (
            <>
              <span className={`${classes.settingsActionTitle}`}>Blocked</span>
              {blockedData.length !== 0 ? (
                blockedData.map((elem) => {
                  return (
                    <SearchResultContainer
                      src={elem.imgUrl}
                      username={elem.username}
                      id={elem.id}
                    />
                  );
                })
              ) : (
                <div className={`${classes.notFountText}`}>
                  You are A good human being and not blocked anyone :)
                </div>
              )}
            </>
          )}{' '}
        </div>
      </Modal>

      <MenuList className={`${classes.menu}`}>
        <MenuItem
          className={`${classes.menuItem}`}
          onClick={() => {
            setOpenModal(true);
            setModalSelected({ modalSelected: false, bookmarks: true });
          }}
        >
          <ListItemIcon>
            <Bookmarks />
          </ListItemIcon>
          <ListItemText>Bookmarks</ListItemText>
          <Typography>{bookmarked.length}</Typography>
        </MenuItem>
        <MenuItem
          className={`${classes.menuItem}`}
          onClick={() => {
            setOpenModal(true);
            setModalSelected({ modalSelected: false, following: true });
          }}
        >
          <ListItemIcon>
            <CallMissed />
          </ListItemIcon>
          <ListItemText>Followings</ListItemText>
          <Typography>{followings.length - 1}</Typography>
        </MenuItem>
        <MenuItem
          className={`${classes.menuItem}`}
          onClick={() => {
            setOpenModal(true);
            setModalSelected({ modalSelected: false, followers: true });
          }}
        >
          <ListItemIcon>
            <East />
          </ListItemIcon>
          <ListItemText>Followers</ListItemText>
          <Typography>{followers.length}</Typography>
        </MenuItem>
        <MenuItem
          className={`${classes.menuItem}`}
          onClick={() => {
            setOpenModal(true);
            setModalSelected({ modalSelected: false, blocked: true });
          }}
        >
          <ListItemIcon>
            <Block />
          </ListItemIcon>
          <ListItemText>Blocked</ListItemText>
          <Typography>{blocked.length}</Typography>
        </MenuItem>
      </MenuList>
    </div>
  );
};

export default ProfileSettingsActions;
