import React, { useEffect, useState } from 'react';
import { forwardRef } from 'react';
import GoToPost from '../components/GoToPost';

import classes from './ExplorePost.module.css';
const ExplorePost = forwardRef((props, ref) => {
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = (a) => setOpenModal(a);
  return (
    <div
      className={`${classes.post} ${props.className}`}
      style={props.style}
      key={props.keyy}
      ref={ref}
      onClick={() => setOpenModal(true)}
    >
      {props.src && (
        <img
          className={`${classes.postImg}`}
          src={`${props.src}`}
          alt="explore post"
        />
      )}
      <GoToPost
        open={openModal}
        onClose={handleCloseModal}
        id={props.id}
        postId={props.postId}
      />
    </div>
  );
});

export default ExplorePost;
