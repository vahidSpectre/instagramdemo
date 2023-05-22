import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import classes from './SearchResultContainer.module.css';

import CostumeFollowBtn from './CostumeFollowBtn';

const SearchResultContainer = (props) => {
  const nav = useNavigate();

  const hanldeGoToProfile = () => {
    nav('/profile', { state: { id: props.id } });
  };
  return (
    <div key={props.id} className={`${classes.wrapper}`}>
      <span className={`${classes.avatar}`}>
        <Avatar src={`${props.src}`}></Avatar>
      </span>
      <span className={`${classes.username}`}>{props.username}</span>
      <span className={`${classes.followBtnWrapper}`}>
        <button
          onClick={hanldeGoToProfile}
          className={`${classes.searchResultAction} ${classes.textGrey}`}
        >
          View profile
        </button>
      </span>
      <span className={`${classes.followBtnWrapper}`}>
        <CostumeFollowBtn id={props.id} />
      </span>
    </div>
  );
};

export default SearchResultContainer;
