import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

import CommentBox from './CommentBox';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

import classes from './Comments.module.css';
const Comments = (props) => {
  const [data, setdata] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const commentsRef = doc(db, 'comments', `${props.id}`);

  useEffect(() => {
    const fetchComments = async () => {
      const docs = onSnapshot(commentsRef, (doc) => {
        setdata(doc.data()[`${props.postId}`]);
      });
    };
    fetchComments();
  }, []);

  const comFn = (a, b) => {
    if (a.timestamp > b.timestamp) {
      return -1;
    }
    if (a.timestamp < b.timestamp) {
      return 1;
    } else return;
  };

  useEffect(() => {
    setRenderData(data?.sort(comFn));
  }, [data]);

  return (
    <div className={classes.wrapper}>
      {data?.length !== 0 ? (
        renderData?.length !== 0 ? (
          renderData?.map((elem, id) => {
            return (
              <CommentBox
                comment={elem.comment}
                keyy={elem.commentId}
                id={elem.commentId}
                timestamp={elem.timestamp}
              />
            );
          })
        ) : (
          <span className={`${classes.center} ${classes.spinner}`}>
            <CircularProgress size={'1.5rem'} className={classes.loader} />
          </span>
        )
      ) : (
        <span className={`${classes.center} ${classes.spinner}`}>
          no comments yet!
        </span>
      )}
    </div>
  );
};

export default Comments;
