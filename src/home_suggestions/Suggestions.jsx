import React, { useContext, useEffect, useState } from 'react';
import CustomeAvatar from '../components/CustomeAvatar';
import Suggestionbox from './Suggestionbox';

import { AuthContext } from '../context/AuthContext';
import classes from './Suggestions.module.css';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
function Suggestions() {
  const [imgUrl, setImgUrl] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [renderData, setRenderData] = useState([]);

  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const ref = doc(db, 'users', currentUser.uid);
    const fetchData = async () => {
      const docs = await getDoc(ref);
      if (docs.exists()) {
        const tempData = docs.data();
        setImgUrl(tempData.backgroundImg);
        setUsername(tempData.username);
        setBio(tempData.bio);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const ref = doc(db, 'users', currentUser.uid);
    const unSub = onSnapshot(ref, (docs) => {
      setFollowing(docs.data().following);
    });
  }, []);

  useEffect(() => {
    setSuggestions([]);
    if (following) {
      following.map((elem) => {
        const ref = doc(db, 'users', elem);
        const unSub = onSnapshot(ref, (docs) => {
          setSuggestions((data) => [...data, ...docs.data().following]);
        });
      });
    }
  }, [following]);

  useEffect(() => {
    setRenderData([]);
    if (following && suggestions) {
      setRenderData(suggestions.filter((x) => !following.includes(x)));
    }
  }, [following, suggestions]);

  return (
    <div className={classes.container}>
      <div className={classes.userInfo}>
        <CustomeAvatar
          size={'large'}
          dispalyUsername={true}
          userName={username}
          displayBio={true}
          bio={bio}
          src={imgUrl}
          active={false}
          class={classes.avatar}
        />
        <button className={`${classes.showAllText} ${classes.switchBtn}`}>
          Switch
        </button>
      </div>
      <div className={classes.showAll}>
        <span className={`${classes.showAllText} ${classes.suggestionText}`}>
          Suggestions for you
        </span>
        <button className={`${classes.showAllText} ${classes.showBtn}`}>
          <span>Show All</span>
        </button>
      </div>
      {renderData.map((elem) => {
        return <Suggestionbox id={elem} />;
      })}
    </div>
  );
}

export default Suggestions;
