import React, { useContext, useEffect, useState, memo, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { db } from '../Firebase/firebase';

import classes from './PostsContainer.module.css';
import Stories from '../stories/Stories';
import Post from './Post';

const PostsContainer = () => {
  const { currentUser } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [render, setRender] = useState(false);
  const [id, setId] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [intersectingData, setIntersectingData] = useState([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [page, setPage] = useState(1);

  const postRef = useRef();

  const observer = new IntersectionObserver(([entry]) => {
    setIsIntersecting(entry.isIntersecting);
  });
  if (postRef.current) {
    observer.observe(postRef.current);
  }

  useEffect(() => {
    setPage(1);

    setId([]);
    setData([]);
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (docc) => {
      setId(docc.data().following);
    });
  }, []);

  useEffect(() => {
    setData([]);
    const fetchPosts = () => {
      id.forEach((elem, i) => {
        const ref = doc(db, 'posts', elem);
        onSnapshot(ref, (docs) => {
          const dataLength = Object.values(docs.data()).length;

          for (let i = 0; i < dataLength; i++) {
            const tempData = Object.values(docs.data())[i];
            setData((data) => [
              ...data,
              {
                id: docs.id,
                imgUrl: tempData.imgUrl,
                caption: tempData.caption,
                timestamp: tempData.timeLine,
                postId: tempData.id,
              },
            ]);
          }
        });
      });
    };

    fetchPosts();
  }, [id]);

  useEffect(() => {
    var helper = [];

    const result = data.filter((elem) => {
      id.map((id) => {
        if (id === elem.id) {
          helper.push(elem);
        }
      });
    });

    const removedDuplicates = Object.values(helper).reduce((unique, o) => {
      if (!unique.some((obj) => obj.imgUrl === o.imgUrl)) {
        unique.push(o);
      }
      return unique;
    }, []);

    const comFn = (a, b) => {
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      if (a.timestamp < b.timestamp) {
        return 1;
      } else return;
    };

    setRenderData(Object.values(removedDuplicates).sort(comFn));
  }, [data]);

  useEffect(() => {
    if (intersectingData) {
      setRender(true);
    }
  }, [intersectingData]);

  const loadMorePosts = () => {
    for (let j = intersectingData.length; j < page * 3; j++) {
      if (renderData[j] !== undefined) {
        setIntersectingData((data) => [...data, renderData[j]]);
      }
    }
  };

  useEffect(() => {
    if (renderData) {
      loadMorePosts();
    }
  }, [renderData]);

  useEffect(() => {
    if (isIntersecting) {
      if (intersectingData.length < renderData.length) {
        setPage(page + 1);
      }
      loadMorePosts();
    }
  }, [isIntersecting]);

  return (
    <div className={classes.container}>
      <Stories />
      {render &&
        intersectingData.map((e, i) => {
          return (
            <Post
              id={e.id}
              img={e.imgUrl}
              caption={e.caption}
              timestamp={e.timestamp}
              ref={postRef}
              postId={e.postId}
              keyy={e.postId}
            />
          );
        })}
    </div>
  );
};

export default memo(PostsContainer);
