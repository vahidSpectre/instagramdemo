import { Button } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import classes from './Login.module.css';

function Login() {
  const [goToHome, setGoToHome] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [weakPasswordError, setWeakPasswordError] = useState(false);

  const { dispach } = useContext(AuthContext);

  const navigate = useNavigate();
  const SingIn = () => {
    signInWithEmailAndPassword(auth, userName, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispach({ type: 'LOGIN', payload: user });
        setGoToHome(true);
      })
      .catch((error) => {
        setError(true);
      });
  };
  useEffect(() => {
    if (password.length < 6) {
      setWeakPasswordError(true);
    } else {
      setWeakPasswordError(false);
    }
  }, [password]);
  const handleNavigateToSignin = () => {
    navigate('/signup');
  };

  return (
    <div className={`${classes.container} ${classes.center}`}>
      <div className={`${classes.leftSide}`}>
        <img
          className={classes.instagramImg}
          src={require('../media/pngwing.com.png')}
        />
        <div className={`${classes.text}`}>
          <p className={`${classes.textBlack}`}>
            This app is a demo base on Instagram web version
          </p>
          <p className={`${classes.textBlack}`}>
            contact: <strong>vahidseyfollahzadeh@gmail.com</strong>
          </p>
          <p className={`${classes.mt1} ${classes.textBlack}`}>
            demo by vahid seyfollahzadeh&copy;
          </p>
        </div>
      </div>
      <div className={`${classes.rightSide}`}>
        <form className={`${classes.formWrapper}`}>
          <div className={`${classes.formInputWrapper}`}>
            <span className={`${classes.center} ${classes.flexC}`}>
              <label htmlFor="username" className={`${classes.mb1}`}>
                Email
              </label>
              <input
                id="username"
                type="email"
                className={`${classes.formInput}`}
                onChange={(e) => setUserName(e.target.value)}
              />
            </span>
            <span className={`${classes.center} ${classes.flexC}`}>
              <label htmlFor="password" className={`${classes.mb1}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`${classes.formInput}`}
                onChange={(e) => setPassword(e.target.value)}
              />
            </span>
            <p
              className={`${classes.errorMsg} ${classes.mb1}`}
              style={{
                opacity: `${error || weakPasswordError ? 1 : 0}`,
              }}
            >
              {error
                ? 'username or password is wrong'
                : 'this password is too weak'}
            </p>
            <Button
              variant="outlined"
              className={`${classes.submitBtn} ${classes.mt1}`}
              onClick={SingIn}
              disabled={weakPasswordError ? true : false}
            >
              LogIn
            </Button>
          </div>
          <h6 className={`${classes.signinText}`}>
            Don't have an account?&nbsp;
            <button
              onClick={handleNavigateToSignin}
              className={`${classes.signinButton}`}
            >
              SignIn
            </button>
          </h6>
        </form>
      </div>
      {goToHome && <Navigate to="/" />}
    </div>
  );
}

export default Login;
