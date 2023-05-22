import { CircularProgress } from '@mui/material';
import React, { forwardRef, useState } from 'react';

import classes from './ImageMessage.module.css';
const ImageMessage = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      key={props.keyy}
      ref={ref}
      className={`${classes.wrapper} ${props.user ? classes.user : ''}`}
    >
      <img
        className={`${classes.img} ${loading ? classes.dn : ''}`}
        src={props.src}
        onLoad={() => setLoading(false)}
      />
      {loading && <CircularProgress />}
    </div>
  );
});

export default ImageMessage;
