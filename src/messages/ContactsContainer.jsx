import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../context/AuthContext';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../Firebase/firebase';

import classes from './ContactsContainer.module.css';
import ContactBox from './ContactBox';
import {
  Icon,
  Input,
  InputAdornment,
  Modal,
  Skeleton,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
const ContactsContainer = (props) => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [allUsersData, setAllUsersData] = useState([]);
  const [searchedUserData, setSearchedUserData] = useState([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const ref = doc(db, 'messages', currentUser.uid);
    const userRef = doc(db, 'users', currentUser.uid);
    const fetchData = async () => {
      setData([]);
      const unsub = onSnapshot(ref, (doc) => {
        setData(doc.data());
      });
    };
    const getUsername = async () => {
      const docs = await getDoc(userRef);
      if (docs.exists()) {
        setUsername(docs.data().username);
      }
    };
    fetchData();
    getUsername();
  }, []);

  const handleLiftData = (a, b, c) => {
    props.liftData(a, b, c);
    handleCloseModal();
  };

  useEffect(() => {
    if (openModal === true) {
      setAllUsersData([]);
      const ref = collection(db, 'users');
      const fetchData = async () => {
        const docs = await getDocs(ref);
        docs.forEach((doc) => {
          if (doc.id !== currentUser.uid) {
            setAllUsersData((data) => [
              ...data,
              {
                username: doc.data().username,
                bio: doc.data().bio,
                id: doc.id,
                imgUrl: doc.data().backgroundImg,
              },
            ]);
          }
        });
      };
      fetchData();
    }
  }, [openModal]);

  useEffect(() => {
    if (searchUser !== '') {
      setSearchedUserData(
        allUsersData.filter((elem) => {
          if (String(elem.username).toLowerCase().includes(searchUser)) {
            return elem;
          } else {
            return null;
          }
        })
      );
    }
  }, [searchUser]);

  useEffect(() => {
    console.log(searchedUserData);
  }, [searchedUserData]);

  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className={`${classes.wrapper}`}>
      <Modal
        className={`${classes.modal}`}
        open={openModal}
        onClose={handleCloseModal}
      >
        <div className={`${classes.modalContainer}`}>
          <div className={`${classes.modalHeader}`}>
            <Typography className={`${classes.modalTitle}`}>
              Send message
            </Typography>
            <Input
              className={`${classes.modalInput}`}
              onChange={(e) => {
                setSearchUser(e.target.value);
              }}
              disableUnderline
              placeholder="Users..."
              endAdornment={
                <InputAdornment position="end">
                  <Icon className={`${classes.searchIcon}`}>
                    <Search />
                  </Icon>
                </InputAdornment>
              }
            ></Input>
          </div>
          <div className={`${classes.modalData}`}>
            {searchUser === ''
              ? allUsersData.map((elem) => {
                  return (
                    <ContactBox
                      keyy={elem.id}
                      id={elem.id}
                      liftData={handleLiftData}
                    />
                  );
                })
              : searchedUserData.map((elem) => {
                  return (
                    <ContactBox
                      keyy={elem.id}
                      id={elem.id}
                      liftData={handleLiftData}
                    />
                  );
                })}
          </div>
        </div>
      </Modal>
      <div className={`${classes.CCHeader}`}>
        {username ? (
          <div className={`${classes.username}`}>{username}</div>
        ) : (
          <Skeleton className={`${classes.usernameSkeleton}`}></Skeleton>
        )}
        <button
          className={`${classes.newMsgBtn}`}
          onClick={() => setOpenModal(true)}
        ></button>
      </div>
      {data ? (
        Object.keys(data).map((elem) => {
          return <ContactBox keyy={elem} id={elem} liftData={handleLiftData} />;
        })
      ) : (
        <>
          <span className={`${classes.skeletonWrapper}`}>
            <Skeleton
              className={`${classes.avatarSkeleton}`}
              variant="circular"
            />
            <Skeleton className={`${classes.textSkeleton}`} variant="text" />
          </span>
          <span className={`${classes.skeletonWrapper}`}>
            <Skeleton
              className={`${classes.avatarSkeleton}`}
              variant="circular"
            />
            <Skeleton className={`${classes.textSkeleton}`} variant="text" />
          </span>
          <span className={`${classes.skeletonWrapper}`}>
            <Skeleton
              className={`${classes.avatarSkeleton}`}
              variant="circular"
            />
            <Skeleton className={`${classes.textSkeleton}`} variant="text" />
          </span>
          <span className={`${classes.skeletonWrapper}`}>
            <Skeleton
              className={`${classes.avatarSkeleton}`}
              variant="circular"
            />
            <Skeleton className={`${classes.textSkeleton}`} variant="text" />
          </span>
          <span className={`${classes.skeletonWrapper}`}>
            <Skeleton
              className={`${classes.avatarSkeleton}`}
              variant="circular"
            />
            <Skeleton className={`${classes.textSkeleton}`} variant="text" />
          </span>
        </>
      )}
    </div>
  );
};

export default ContactsContainer;
