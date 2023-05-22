import React, { useEffect, useState, useContext } from 'react';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { storage, db } from '../Firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import { Button, Input } from '@mui/material';

import classes from './CreatePost.module.css';

import svg from '../media/Add-svg-icon.svg';
import successGif from '../media/Project_Name.mp4';
import { useRef } from 'react';

const CreatePost = () => {
  const [file, setFile] = useState('');
  const [postImg, setPostImg] = useState('');
  const [caption, setCaption] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressError, setProgressError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [postLength, setPostLength] = useState(0);

  const { currentUser } = useContext(AuthContext);

  const inputRef = useRef();
  const fileRef = useRef();

  const randomNameGenarator = Math.floor(Math.random() * 992125654198);

  const storageRef = ref(storage, `posts/${randomNameGenarator}.jpeg`);
  const userDocumentRef = doc(db, 'posts', currentUser.uid);
  const userCommentstRef = doc(db, 'comments', currentUser.uid);

  useEffect(() => {
    const fetchData = async () => {
      const docs = await getDoc(userDocumentRef);
      if (docs.exists()) {
        setPostLength(Object.values(docs.data()).length);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        setProgressError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPostImg(downloadURL);
        });
      }
    );
  }, [file]);

  const handleUploadNewPost = async () => {
    await updateDoc(userDocumentRef, {
      [randomNameGenarator]: {
        imgUrl: postImg,
        timeLine: new Date().toISOString(),
        caption: caption,
        likes: [],
        id: randomNameGenarator,
      },
    });
    await updateDoc(userCommentstRef, {
      [`${randomNameGenarator}`]: [],
    });
    const unsnap = onSnapshot(userDocumentRef, (doc) => {
      const length = Object.values(doc.data()).length;
      if (length === postLength + 1) {
        setSuccess(true);
        setPostLength(postLength + 1);
      } else {
        setSuccess(false);
      }
    });
  };

  const handleResetPost = () => {
    inputRef.current.value = '';
    fileRef.current.value = '';
    setPostImg('');
    setCaption('');
    setSuccess(false);
  };

  return (
    <div className={`${classes.container} ${classes.center}`}>
      <div className={`${classes.wrapper} ${classes.center}`}>
        <label
          htmlFor="uploadImg"
          className={`${classes.uploadImgContainer} ${classes.center}`}
        >
          {postImg ? (
            <img
              src={`${postImg}`}
              className={`${classes.uploadBackground}`}
              style={{
                width: '100%',
                height: '100%',
              }}
              onLoad={() => setProgress(0)}
            />
          ) : (
            <img
              src={`${svg}`}
              className={`${classes.uploadBackground}`}
              style={{
                width: '20%',
                height: '20%',
              }}
            />
          )}
          <div
            className={`${classes.progressBar}`}
            style={{
              width: `${progress}%`,
              opacity: `${progress !== 100 ? 0 : 1}`,
              backgroundColor: `${progressError ? 'red' : 'rgb(153, 255, 1)'}`,
            }}
          />
          <div
            className={`${classes.progressBar}`}
            style={{
              width: '100%',
              backgroundColor: 'red',
              display: `${progressError ? 'block' : 'none'}`,
            }}
          />
        </label>
        <input
          id="uploadImg"
          type="file"
          className={`${classes.displaynone}`}
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
        ></input>
        <span className={`${classes.captionContainer}`}>
          <Input
            id="newpostcaption"
            type="text"
            className={`${classes.captionInput}`}
            placeholder="Add a caption..."
            multiline
            disableUnderline
            maxRows={'3'}
            onChange={(e) => setCaption(e.target.value)}
            inputRef={inputRef}
          ></Input>
        </span>
        <span className={`${classes.btnSection}`}>
          <Button variant="outlined" color="error" onClick={handleResetPost}>
            Discard
          </Button>
          {success && (
            <>
              <video className={`${classes.successGif}`} autoPlay muted>
                <source src={successGif} type="video/mp4" />
              </video>
              <img src={successGif} style={{ display: 'none' }} />
            </>
          )}
          <Button
            variant="outlined"
            onClick={handleUploadNewPost}
            disabled={!caption || !postImg}
          >
            &nbsp; &nbsp;Post&nbsp; &nbsp;
          </Button>
        </span>
      </div>
    </div>
  );
};

export default CreatePost;
