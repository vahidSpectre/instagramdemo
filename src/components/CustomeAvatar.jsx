import React, { useEffect, useState } from 'react';

import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import classes from './CustomeAvatar.module.css';
const CustomeAvatar = (props) => {
  const [active, setactive] = useState(false);

  useEffect(() => {
    if (props.id) {
      const ref = doc(db, 'stories', props.id);

      const fetchData = async () => {
        const docs = await getDoc(ref);
        if (docs.exists()) {
          if (docs.data().storyimglink !== '') {
            setactive(true);
          } else {
            setactive(false);
          }
        }
      };
      fetchData();
    }
  }, []);

  return (
    <div
      className={`${classes.wrapper} ${props.class}`}
      onClick={() => {
        setactive(false);
        props.onClick();
      }}
    >
      <div
        className={`${classes.avatarwrapper} ${classes.center} ${
          active ? classes.active : classes.deactive
        } ${props.loadingBorder ? classes.loadingBorder : ''}`}
        style={{
          width: `${props.size === 'large' ? '4rem' : '2.5rem'}`,
          height: `${props.size === 'large' ? '4rem' : '2.5rem'}`,
        }}
      >
        <div
          className={`${classes.avatarvoid} ${classes.center}`}
          style={{
            width: `${
              props.size === 'large'
                ? 'calc(4rem - (4px))'
                : 'calc(2.5rem - (4px))'
            }`,
            height: `${
              props.size === 'large'
                ? 'calc(4rem - (4px))'
                : 'calc(2.5rem - (4px))'
            }`,
          }}
        >
          <img className={classes.image} src={props.src} />
        </div>
      </div>
      <div className={classes.info}>
        {props.dispalyUsername && (
          <span
            className={`${classes.username} ${props.textProp}`}
            style={{ fontWeight: `${props.boldText && 'bolder'}` }}
          >
            {props.userName}
          </span>
        )}
        {props.displayBio && (
          <span
            className={`${classes.bio} ${props.textProp}`}
            style={{ fontWeight: `${props.boldText && 'bolder'}` }}
          >
            {props.bio}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomeAvatar;
