import React, { useState, useEffect, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';
import { db } from '../Firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import LikeNotifs from './LikeNotifs';
import FollowNotifs from './FollowNotifs';

import classes from './Notifications.module.css';
const Notifications = (props) => {
  const [data, setData] = useState([]);
  const [renderData, setRenderData] = useState([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const userNotifRef = doc(db, 'userstate', currentUser.uid);
    const unsub = onSnapshot(userNotifRef, (doc) => {
      if (doc.exists()) {
        setData(doc.data().notif);
      }
    });
  }, []);

  const compFn = (a, b) => {
    if (a.timestamp > b.timestamp) {
      return -1;
    }
    if (a.timestamp < b.timestamp) {
      return 1;
    } else return;
  };

  useEffect(() => {
    if (data) {
      setRenderData(data.sort(compFn));
      props.newNotif(true);
    }
  }, [data]);

  return (
    <div className={`${classes.wrapper}`}>
      {renderData?.map((elem) => {
        if (elem.type === 'LIKE' || elem.type === 'DISLIKE') {
          return (
            <LikeNotifs
              keyy={elem.timestamp}
              id={elem.id}
              postId={elem.postid}
              type={elem.type}
              timestamp={elem.timestamp}
            />
          );
        }
        if (elem.type === 'FOLLOW' || elem.type === 'UNFOLLOW') {
          return (
            <FollowNotifs
              keyy={elem.timestamp}
              id={elem.id}
              type={elem.type}
              timestamp={elem.timestamp}
            />
          );
        }
      })}
    </div>
  );
};

export default Notifications;
