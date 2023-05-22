import React, { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Input, InputAdornment } from '@mui/material';

import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../Firebase/firebase';
import { AuthContext } from '../context/AuthContext';

import classes from './MessagesContainer.module.css';
import { Flare, PermMedia } from '@mui/icons-material';
import MessagesViewBox from './MessagesViewBox';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
const MessagesContainer = (props) => {
  const [data, setData] = useState({});
  const [id, setId] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState('');
  const [imgMessageUrl, setImgMessageUrl] = useState('');

  const { currentUser } = useContext(AuthContext);
  const input = useRef();

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setId(data.id);
  }, [data]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setMessage('');
    input.current.value = '';
    const ref = doc(db, 'messages', currentUser.uid);
    await updateDoc(ref, {
      [`${id}`]: arrayUnion({
        message: message,
        type: 'text',
        timestamp: new Date().toISOString(),
        id: currentUser.uid,
      }),
    });
  };

  useEffect(() => {
    if (file !== '') {
      const fileName = Math.random() * 999999654198;
      const storageRef = ref(storage, `fileMessages/${fileName}.jpeg`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgMessageUrl(downloadURL);
          });
        }
      );
    }
  }, [file]);

  useEffect(() => {
    const ref = doc(db, 'messages', currentUser.uid);
    const send = async () => {
      await updateDoc(ref, {
        [`${id}`]: arrayUnion({
          message: imgMessageUrl,
          type: 'photo',
          timestamp: new Date().toISOString(),
          id: currentUser.uid,
        }),
      });
    };
    if (imgMessageUrl !== '' && id !== undefined) {
      send();
    }
  }, [imgMessageUrl]);

  return (
    <div className={`${classes.wrapper}`}>
      <div className={`${classes.header}`}>
        <Avatar className={`${classes.avatar}`} src={data.src} />
        <h2 className={`${classes.username}`}>{data.username}</h2>
      </div>
      <MessagesViewBox id={id} className={classes.viewBox} />
      <form className={`${classes.footer}`} onSubmit={handleSendMessage}>
        <Input
          placeholder="Message..."
          className={`${classes.input}`}
          disableUnderline
          onChange={(e) => setMessage(e.target.value)}
          inputRef={input}
          endAdornment={
            <InputAdornment position="end">
              <label className={`${classes.mediaBtn}`} htmlFor="file">
                <PermMedia />
              </label>
              <input
                className={`${classes.dn}`}
                type="file"
                name="file"
                id="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </InputAdornment>
          }
        />
      </form>
    </div>
  );
};

export default MessagesContainer;
