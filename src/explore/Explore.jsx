import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';

import { db } from '../Firebase/firebase';
import classes from './Explore.module.css';
import ExplorePost from './ExplorePost';

const Explore = () => {
  const [fetchedData, setFetchedData] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [renderData, setRenderData] = useState(false);

  const explorePostRef = useRef();
  useEffect(() => {
    const fetchData = async () => {
      const query = await getDocs(collection(db, 'posts'));
      query.forEach((doc) => {
        const objectLength = Object.values(doc.data()).length;
        for (let i = 0; i < objectLength; i++) {
          const tempData = Object.values(doc.data())[i];

          setFetchedData((data) => [
            ...data,
            {
              id: doc.id,
              imgUrl: tempData.imgUrl,
              caption: tempData.caption,
              timestamp: tempData.timeLine,
              postId: tempData.id,
            },
          ]);
        }
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPage(2);
    loadMorePost();
  }, [fetchedData]);

  const observer = new IntersectionObserver(([entry]) => {
    setIsIntersecting(entry.isIntersecting);
  });
  if (explorePostRef.current) {
    observer.observe(explorePostRef.current);
  }

  const loadMorePost = () => {
    if (data.length < fetchedData.length) {
      for (let i = data.length; i < page * 30; i++) {
        setData((data) => [...data, Object.values(fetchedData)[i]]);
      }
    }
  };

  useEffect(() => {
    if (isIntersecting) {
      setPage(page + 1);
      loadMorePost();
      setRenderData(true);
    }
  }, [isIntersecting]);

  useEffect(() => {
    if (data) {
      setRenderData(true);
    }
  }, [data]);

  return (
    <div className={classes.explore}>
      {renderData &&
        data.map((elem, i) => {
          if (elem) {
            if (i % 10 === 0 && i !== 0) {
              var j = i / 10;
              var pos = [j * 2 + j];
              return (
                <ExplorePost
                  caption={elem.caption}
                  id={elem.id}
                  postId={elem.postId}
                  src={elem.imgUrl}
                  className={`${classes.hugePostRight}`}
                  style={{ gridArea: `${pos[0]}/4/${pos[0] + 2}/6` }}
                  keyy={i}
                  ref={explorePostRef}
                />
              );
            }
            if (i % 15 === 0 && i !== 0) {
              var j = i / 15;
              var pos = [j * 1 + j];
              return (
                <ExplorePost
                  caption={elem.caption}
                  id={elem.id}
                  postId={elem.postId}
                  src={elem.imgUrl}
                  className={`${classes.hugePostRight}`}
                  style={{ gridArea: `${pos[0]}/1/${pos[0] + 2}/3` }}
                  keyy={i}
                  ref={explorePostRef}
                />
              );
            }
            return (
              <ExplorePost
                caption={elem.caption}
                id={elem.id}
                postId={elem.postId}
                src={elem.imgUrl}
                keyy={i}
                ref={explorePostRef}
              />
            );
          }
        })}
    </div>
  );
};

export default Explore;
