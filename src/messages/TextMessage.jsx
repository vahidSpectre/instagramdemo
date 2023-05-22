import React, { forwardRef } from 'react';

import classes from './TextMessage.module.css';
const TextMessage = forwardRef((props, ref) => {
  return (
    <div
      key={props.keyy}
      className={`${classes.wrapper} ${props.user ? classes.user : ''}`}
      ref={ref}
    >
      {props.message}
    </div>
  );
});

export default TextMessage;
