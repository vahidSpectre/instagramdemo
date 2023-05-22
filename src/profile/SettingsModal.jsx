import React, { useContext, useEffect, useState } from 'react';

import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, storage } from '../Firebase/firebase';
import { AuthContext } from '../context/AuthContext';

import classes from './SettingsModal.module.css';
import { Button, CircularProgress, Input } from '@mui/material';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import ProfileSettingsActions from './ProfileSettingsActions';
const SettingsModal = () => {
  const [profileImg, setProfileImg] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [savedPosts, setSavedPosts] = useState([]);
  const [file, setFile] = useState('');
  const [progress, setProgress] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fileName = Math.random() * 999999654198;

  const refUser = doc(db, 'users', currentUser.uid);
  const storageRef = ref(storage, `profileImages/${fileName}.jpeg`);

  useEffect(() => {
    const fetchData = async () => {
      const unSub = onSnapshot(refUser, (docs) => {
        setProfileImg(docs.data().backgroundImg);
        setUsername(docs.data().username);
        setBio(docs.data().bio);
        setSavedPosts(docs.data().savedposts);
      });
    };
    if (currentUser.uid) {
      fetchData();
    }
  }, []);

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
            setProfileImg(downloadURL);
            setProgress(false);
          });
        }
      );
    }
  }, [file]);

  const updateData = async (e) => {
    e.preventDefault();
    await updateDoc(refUser, {
      backgroundImg: profileImg,
      bio: bio,
      username: username,
    });
  };

  return (
    <div className={`${classes.wrapper}`}>
      <form className={`${classes.container}`} onSubmit={updateData}>
        <div className={`${classes.imgSection}`}>
          <label htmlFor="img" className={`${classes.imgLabel}`}>
            <img
              src={profileImg}
              className={`${classes.img}`}
              style={{ opacity: `${progress ? '.5' : '1'}` }}
            />
            {progress && (
              <CircularProgress className={`${classes.progressBar}`} />
            )}
          </label>
          <input
            type="file"
            id="img"
            className={`${classes.dn}`}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className={`${classes.dataSection}`}>
          <label htmlFor="username" className={`${classes.label}`}>
            User name:
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`${classes.input}`}
            multiline
          />
          <label htmlFor="bio" className={`${classes.label}`}>
            Bio:
          </label>
          <Input
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`${classes.input}`}
            multiline
            disableUnderline
          />
        </div>
        <Button
          className={`${classes.submitBtn}`}
          variant="outlined"
          type="submit"
        >
          Update
        </Button>
      </form>
      <div className={`${classes.settingsMenu}`}>
        <ProfileSettingsActions />
      </div>
    </div>
  );
};

export default SettingsModal;
