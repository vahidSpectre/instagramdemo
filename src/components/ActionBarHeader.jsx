import { SvgIcon } from '@mui/material';
import React from 'react';

import { ReactComponent as logo } from '../media/Instagram_Logo_2016.svg';
import { ReactComponent as logo2 } from '../media/instagram-logo=1.svg';

import classes from './ActionBarHeader.module.css';
function ActionBarHeader(props) {
  return (
    <div className={classes.container}>
      {props.headerWidth < 980 || props.extended ? (
        <SvgIcon
          component={logo2}
          viewBox="0 0 35 35"
          className={classes.logo2}
        />
      ) : (
        <SvgIcon
          component={logo}
          viewBox="0 0 1000 284"
          className={classes.logo}
        />
      )}
    </div>
  );
}

export default ActionBarHeader;
