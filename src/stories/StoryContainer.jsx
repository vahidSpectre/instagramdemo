import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, storage } from '../Firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import useDifference from '../hooks/useDifference';
import { Avatar, CircularProgress, Modal } from '@mui/material';
import { Add } from '@mui/icons-material';
import CustomeAvatar from '../components/CustomeAvatar';
import classes from './StoryContainer.module.css';

const StoryContainer = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const [displayNone, setDisplayNone] = useState(false);
  const [storyImgUrl, setStoryImgUrl] = useState();
  const [addNewStory, setAddNewStory] = useState(false);
  const [file, setFile] = useState('');
  const [progress, setProgress] = useState(false);
  const [newStory, setnewStory] = useState('');
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');

  const { currentUser } = useContext(AuthContext);

  const time = useDifference(timestamp);
  const key = Math.floor(Math.random() * 1000);
  const fileName = Math.random() * 999999654198;
  const storageRef = ref(storage, `profileImages/${fileName}.jpeg`);

  useEffect(() => {
    const ref = doc(db, 'stories', props.id);
    const unSub = onSnapshot(ref, (docs) => {
      if (docs.data().storyimglink === '') {
        if (props.id !== currentUser.uid) {
          setDisplayNone(true);
        } else {
          setStoryImgUrl('');
          setAddNewStory(true);
        }
      } else {
        setStoryImgUrl(docs.data().storyimglink);
        setTimestamp(docs.data().storystart);
        setDisplayNone(false);
        setAddNewStory(false);
      }
    });
  }, [props.id]);

  useEffect(() => {
    if (file !== '') {
      setProgress(true);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setnewStory(downloadURL);
            setProgress(false);
          });
        }
      );
    }
  }, [file]);

  const updateData = async () => {
    const ref = doc(db, 'stories', currentUser.uid);
    await updateDoc(ref, {
      storyimglink: newStory,
      storystart: new Date().toISOString(),
    });
  };
  const resetStory = async () => {
    const ref = doc(db, 'stories', currentUser.uid);
    await updateDoc(ref, {
      storyimglink: '',
      storystart: '',
    });
  };

  useEffect(() => {
    if (newStory !== '') {
      updateData();
    }
  }, [newStory]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (time.includes('Hours') && time > '24 Hours ago') {
      resetStory();
    }
  }, [time, timestamp]);

  return (
    <div
      className={`${classes.wrapper} ${classes.center} ${
        displayNone ? classes.dn : ''
      }`}
      key={props.id}
    >
      <Modal
        className={`${classes.modal} ${classes.center}`}
        open={openModal}
        onClose={handleCloseModal}
        disableAutoFocus
        key={props.id}
      >
        <div className={`${classes.modalContainer} ${classes.center}`}>
          <div className={`${classes.modalHeader}`}>
            <Avatar className={`${classes.avatar}`} src={props.imgUrl} />
            <div className={`${classes.timestamp}`}>{time}</div>
          </div>
          {loading && <CircularProgress />}
          <img
            className={`${classes.img} ${loading ? classes.dn : ''}`}
            src={storyImgUrl}
            onLoad={() => setLoading(false)}
          />
        </div>
      </Modal>
      {props.id === currentUser.uid && !progress && addNewStory ? (
        <>
          <label
            htmlFor="story"
            className={`${classes.addLabel} ${addNewStory ? '' : classes.dn}`}
          >
            <Add
              className={`${classes.add} ${addNewStory ? '' : classes.dn}`}
            />
          </label>
          <input
            className={`${classes.dn}`}
            type="file"
            id="story"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </>
      ) : (
        ''
      )}
      <CustomeAvatar
        id={props.id}
        size={'large'}
        class={classes.costumeAvatar}
        src={props.imgUrl}
        dispalyUsername={true}
        userName={props.username}
        textProp={classes.avatarText}
        onClick={() => setOpenModal(true)}
        loadingBorder={progress}
      />
    </div>
  );
};

export default StoryContainer;
