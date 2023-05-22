import React from 'react';
import PostsContainer from '../components/PostsContainer';
import Suggestions from '../home_suggestions/Suggestions';

import classes from './Home.module.css';
function Home() {
  return (
    <div className={classes.home}>
      <div className={classes.posts}>
        <PostsContainer />
        <Suggestions />
      </div>
    </div>
  );
}

export default Home;
