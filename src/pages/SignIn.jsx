import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { storage, db, auth } from '../Firebase/firebase';
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import classes from './SignIn.module.css';
import {
  Avatar,
  Button,
  IconButton,
  Input,
  InputAdornment,
} from '@mui/material';
import { UploadFile, Visibility, VisibilityOff } from '@mui/icons-material';

import { AuthContext } from '../context/AuthContext';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorText, setErrorText] = useState(' ');
  const [proceed, setProceed] = useState(false);
  const [uploadFileProgress, setUploadFileProgress] = useState(0);
  const [file, setFile] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [finished, setFinished] = useState(false);
  const [user, setUser] = useState([]);

  const { dispach, currentUser } = useContext(AuthContext);
  const nav = useNavigate();

  const fileName = Math.random() * 999999654198;

  const storageRef = ref(storage, `profileImages/${fileName}.jpeg`);

  useEffect(() => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadFileProgress(progress);
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setBackgroundUrl(downloadURL);
        });
      }
    );
  }, [file]);

  useEffect(() => {
    if (finished === true) {
      dispach({ type: 'LOGIN', payload: user });
      nav('/');
    }
  }, [finished]);

  useEffect(() => {
    const create = async () => {
      if (user.uid !== null) {
        await setDoc(doc(db, 'users', user?.uid), {
          username: '',
          bio: '',
          backgroundImg: '',
          blocked: [],
          followers: [],
          following: [user.uid],
          savedposts: [],
        });
        await setDoc(doc(db, 'userstate', user.uid), {
          lastonline: new Date().toISOString(),
          online: false,
        });
        await setDoc(doc(db, 'stories', user.uid), {
          storystart: new Date().toISOString(),
          storyimglink: '',
        });
        await setDoc(doc(db, 'messages', user.uid), {});
        await setDoc(doc(db, 'posts', user.uid), {});
        await setDoc(doc(db, 'comments', user.uid), {});
      }
      setProceed(true);
    };
    create();
  }, [user]);

  const createNewUser = (auth, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        setErrorText('Email or password is not valid!');
      });
  };
  const handleCheckInfo = async (e) => {
    e.preventDefault();
    if (
      password !== repeatPassword &&
      password.length !== 0 &&
      repeatPassword.length !== 0
    ) {
      return setErrorText('Password do not match!');
    }
    if (
      email.length === 0 ||
      password.length === 0 ||
      repeatPassword.length === 0
    ) {
      return setErrorText('You need to fill in the blanks');
    }
    if (
      email.length !== 0 &&
      email.includes('@') &&
      password === repeatPassword
    ) {
      createNewUser(auth, email, password);
      return setErrorText('');
    }
  };

  const handleSignUp = async () => {
    const userDocumentRef = doc(db, 'users', user?.uid);

    await updateDoc(userDocumentRef, {
      bio: bio,
      username: username,
      backgroundImg: backgroundUrl,
    });
    setFinished(true);
  };

  return (
    <div className={`${classes.main} ${classes.center}`}>
      <div className={`${classes.wrapper} ${classes.center}`}>
        <div className={`${classes.mainInfoContainer}`}>
          <form
            autoComplete="off"
            className={`${classes.centerCol}`}
            onSubmit={handleCheckInfo}
          >
            <label htmlFor="email">Enter your Email</label>
            <Input
              size="small"
              name="email"
              id="semail"
              type="email"
              autoComplete="off"
              fullWidth={true}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password" className={`${classes.mt1}`}>
              Choose a password
            </label>
            <Input
              size="small"
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="spassword"
              autoComplete="off"
              fullWidth={true}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disableRipple={true}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <label htmlFor="repeatPassword" className={`${classes.mt1}`}>
              Repeat your password
            </label>
            <Input
              size="small"
              name="repeatPassword"
              type="password"
              id="srepeatPassword"
              autoComplete="off"
              fullWidth={true}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            <p className={`${classes.errorText} ${classes.mt1}`}>{errorText}</p>
            <Button
              className={`${classes.mt2} ${classes.nextBtn}`}
              variant="contained"
              type="submit"
            >
              Next &#129054;
            </Button>
          </form>
        </div>
        <div
          className={`${classes.secondaryInfoContainer}`}
          style={{
            transform: `${proceed ? 'translateX(0)' : 'translateX(25rem)'}`,
          }}
        >
          <span className={`${classes.formSection}`}>
            <form className={`${classes.signUpForm}`}>
              <label htmlFor="file" className={`${classes.center}`}>
                <Avatar
                  src={`${backgroundUrl}`}
                  className={`${classes.avatar}`}
                  variant="circular"
                >
                  <span
                    className={`${classes.progress}`}
                    style={{ height: `${uploadFileProgress}%` }}
                  ></span>
                  <UploadFile fontSize="large" />
                </Avatar>
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                className={`${classes.inputImg}`}
              />
              <span className={`${classes.disflexcol}`}>
                <label htmlFor="userName">User name</label>
                <Input
                  id="userName"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </span>
              <span className={`${classes.disflexcol}`}>
                <label htmlFor="bio">Bio</label>
                <Input id="bio" onChange={(e) => setBio(e.target.value)} />
              </span>
            </form>
          </span>
          <span className={`${classes.btnSection}`}>
            <Button variant="contained" onClick={() => setProceed(false)}>
              &#129052; back
            </Button>
            <Button
              variant="contained"
              className={classes.signUpBtn}
              onClick={handleSignUp}
              disabled={uploadFileProgress !== 100}
            >
              sign up
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
