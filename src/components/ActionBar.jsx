import {
  ArrowBack,
  Close,
  CloseSharp,
  Create,
  Explore,
  FavoriteBorder,
  Home,
  Logout,
  MoreHoriz,
  Movie,
  Search,
  Send,
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Input,
  InputAdornment,
  Modal,
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { db } from '../Firebase/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

import classes from './ActionBar.module.css';
import ActionBarHeader from './ActionBarHeader';
import SearchResultContainer from './SearchResultContainer';
import Notifications from '../notifications/Notifications';

function ActionBar({ children }) {
  const handleCheckActionbarSize = () => {
    setHeader(container.current?.offsetWidth);
  };
  window.addEventListener('resize', handleCheckActionbarSize);

  const [exteded, setExteded] = useState(false);
  const [exteded2, setExteded2] = useState(false);
  const [activeQuery, setActiveQuery] = useState({
    a: true,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [header, setHeader] = useState(0);
  const [data, setData] = useState([]);
  const [uni, setUni] = useState([]);
  const [profileImg, setProfileImg] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [newNotif, setNewNotif] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const nav = useNavigate();
  const location = useLocation();

  const extededConT1 = useRef(null);
  const extededConT2 = useRef(null);
  const extededCon1 = useRef(null);
  const extededCon2 = useRef(null);
  const searchInputbox = useRef(null);
  const container = useRef(null);

  const { currentUser, dispach } = useContext(AuthContext);

  useEffect(() => {
    const ref = doc(db, 'users', currentUser.uid);
    const fetchData = async () => {
      const unsub = onSnapshot(ref, (doc) => {
        setProfileImg(doc.data().backgroundImg);
        setCurrentUsername(String(doc.data().username).toLowerCase());
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    setHeader(container.current?.offsetWidth);
  }, [container.current?.offsetWidth]);

  function useOutsideAlerter(ref, x, y) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          !x.current.contains(event.target)
        ) {
          y(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(extededConT1, extededCon1, setExteded);
  useOutsideAlerter(extededConT2, extededCon2, setExteded2);

  useEffect(() => {
    if (!exteded) {
      setActiveQuery({ ...activeQuery, b: false });
    }
  }, [exteded]);
  useEffect(() => {
    if (!exteded2) {
      setActiveQuery({ ...activeQuery, f: false });
    }
  }, [exteded2]);

  useEffect(() => {
    const allFalse = Object.values(activeQuery).every(
      (value) => value === false
    );
    if (allFalse) {
      if (location.pathname === '/') {
        setActiveQuery({ activeQuery: false, a: true });
      }
      if (location.pathname === '/explore') {
        setActiveQuery({ activeQuery: false, c: true });
      }
      if (location.pathname === '/reels') {
        setActiveQuery({ activeQuery: false, d: true });
      }
      if (location.pathname === '/direct') {
        setActiveQuery({ activeQuery: false, e: true });
      }
    }
  }, [activeQuery]);

  useEffect(() => {
    if (searchInput.length > 0 && searchInput.length < 3) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
    if (searchInput.length < 3) {
      setData([]);
      setUni([]);
    }
    const searchProcess = async () => {
      setData([]);
      const querySnapshot = await getDocs(collection(db, 'users'));

      querySnapshot.forEach((doc) => {
        const username = String(doc.data().username).toLowerCase();
        if (
          currentUsername !== searchInput.toLowerCase() &&
          searchInput.length >= 3 &&
          username.includes(searchInput.toLowerCase())
        ) {
          data.unshift({
            id: doc.id,
            imgUrl: doc.data().backgroundImg,
            username: doc.data().username,
          });
        }
      });
      var unique = data.filter(
        (value, index, array) =>
          index === array.findIndex((elem) => elem.id === value.id)
      );
      setIsSearching(false);
      setUni(unique);
    };
    searchProcess();
  }, [searchInput]);

  useEffect(() => {
    setUni(null);
    handlerRemoveInput();
  }, [exteded]);

  const handlerRemoveInput = () => {
    searchInputbox.current.value = '';
    setUni(null);
    setData([]);
  };

  const updateNewNotif = (n) => {
    setNewNotif(n);
  };

  const handleCloseModal = () => setOpenModal(false);
  return (
    <div
      className={classes.container}
      ref={container}
      onClick={() => {
        setHeader(container.current?.offsetWidth);
      }}
    >
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className={`${classes.modal} ${classes.center}`}
        disableAutoFocus
      >
        <div className={`${classes.modalContainer}`}>
          <div className={`${classes.modalTextSection} ${classes.center}`}>
            Log out?
          </div>
          <div className={`${classes.modalBtnSection}`}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                dispach({ type: 'LOGOUT' });
              }}
            >
              YES
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              NO
            </Button>
          </div>
        </div>
      </Modal>
      <div className={classes.wrapper}>
        <div
          className={classes.actionbar}
          style={{ width: `${exteded || exteded2 ? '4rem' : '14.2rem'}` }}
        >
          <ActionBarHeader
            headerWidth={header}
            extended={exteded || exteded2}
          />
          <div className={classes.menu}>
            <li
              className={`${classes.listItem} `}
              onClick={() => {
                nav('/');
                setActiveQuery({ activeQuery: false, a: true });
              }}
            >
              <span className={`${classes.listIcon} `}>
                <Home
                  className={`${activeQuery.a && classes.listIconActive}`}
                />
              </span>
              <h6
                className={`${classes.listText} ${
                  activeQuery.a && classes.active
                } `}
              >
                Home
              </h6>
            </li>
            <li
              ref={extededConT1}
              className={classes.listItem}
              onClick={() => {
                setExteded(true);
                setActiveQuery({ activeQuery: false, b: true });
              }}
            >
              <span className={classes.listIcon}>
                <Search
                  className={`${activeQuery.b && classes.listIconActive}`}
                />
              </span>
              <h6
                className={`${classes.listText} ${
                  activeQuery.b && classes.active
                } `}
              >
                Search
              </h6>
            </li>
            <li
              className={classes.listItem}
              onClick={() => {
                nav('/explore');
                setActiveQuery({ activeQuery: false, c: true });
              }}
            >
              <span className={classes.listIcon}>
                <Explore
                  className={`${activeQuery.c && classes.listIconActive}`}
                />
              </span>
              <h6
                className={`${classes.listText} ${
                  activeQuery.c && classes.active
                } `}
              >
                Explore
              </h6>
            </li>
            <li
              className={classes.listItem}
              onClick={() => {
                nav('/reels');
                setActiveQuery({ activeQuery: false, d: true });
              }}
            >
              <span className={classes.listIcon}>
                <Movie
                  className={`${activeQuery.d && classes.listIconActive}`}
                />
              </span>
              <h6
                className={`${classes.listText} ${
                  activeQuery.d && classes.active
                } `}
              >
                Reels
              </h6>
            </li>
            <li
              className={classes.listItem}
              onClick={() => {
                nav('/direct');
                setActiveQuery({ activeQuery: false, e: true });
              }}
            >
              <span className={classes.listIcon}>
                <Send
                  className={`${classes.t45deg} ${
                    activeQuery.e && classes.listIconActive
                  }`}
                />
              </span>
              <h6
                className={`${classes.listText} ${
                  activeQuery.e && classes.active
                } `}
              >
                Messages
              </h6>
            </li>
            <li
              className={classes.listItem}
              ref={extededConT2}
              onClick={() => {
                setExteded2(true);
                setActiveQuery({ activeQuery: false, f: true });
                setNewNotif(false);
              }}
            >
              <span className={classes.listIcon}>
                <FavoriteBorder
                  className={`${activeQuery.f && classes.listIconActive}`}
                />
              </span>
              <h6
                className={`${classes.listText} ${
                  activeQuery.f && classes.active
                } `}
              >
                Notifications
              </h6>
              {newNotif && (
                <div className={`${classes.notifDotContainer}`}>
                  <div className={`${classes.notifDot}`}></div>
                  <div className={`${classes.notifDotRipple}`}></div>
                </div>
              )}
            </li>
            <li
              className={classes.listItem}
              onClick={() => {
                setActiveQuery({ activeQuery: false, g: true });
                nav('/create');
              }}
            >
              <span className={classes.listIcon}>
                <Create
                  className={`${activeQuery.g && classes.listIconActive}`}
                />
              </span>
              <h6
                className={`${classes.listText} ${
                  activeQuery.g && classes.active
                } `}
              >
                Create
              </h6>
            </li>
            <li
              className={classes.listItem}
              onClick={() => {
                nav('/profile', { state: { id: currentUser.uid } });
                setActiveQuery({ activeQuery: false, h: true });
              }}
            >
              <span className={classes.listIcon}>
                <Avatar
                  className={`${activeQuery.h && classes.listIconActive}`}
                  src={profileImg}
                  imgProps={{ style: { borderRadius: '50%' } }}
                />
              </span>
              <h6
                className={`${classes.listText} ${
                  activeQuery.h && classes.active
                } ${classes.profile}`}
              >
                <p className={`${classes.profileUsername}`}>Profile&nbsp;</p>
                <span className={`${classes.profileDot}`}></span>
                <div className={`${classes.username}`}>{currentUsername}</div>
              </h6>
            </li>
            <li
              className={`${classes.listItem} ${classes.more}`}
              onClick={() => setOpenModal(true)}
            >
              <span className={classes.listIcon}>
                <Logout fontSize="large" />
              </span>
              <h6 className={`${classes.listText} `}>Log out</h6>
            </li>
          </div>
        </div>
        <div
          className={classes.extendedContainer}
          ref={extededCon1}
          style={{
            width: `${exteded ? '23rem' : '0rem'}`,
          }}
        >
          <span className={classes.searchHeader}>
            <IconButton
              sx={{ alignSelf: 'end', justifySelf: 'flex-start' }}
              onClick={() => setExteded(false)}
            >
              <CloseSharp />
            </IconButton>
            <h2 className={classes.searchText}>Search</h2>
            <Input
              inputRef={searchInputbox}
              disableUnderline
              type="text"
              className={classes.searchInput}
              startAdornment={
                <InputAdornment position="start">
                  <Search sx={{ alignSelf: 'center' }} />
                </InputAdornment>
              }
              onChange={(e) => setSearchInput(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handlerRemoveInput}
                    sx={{
                      width: '.5rem',
                      height: '.5rem',
                      backgroundColor: 'grey',
                      m: '.5rem',
                      '&:hover': { backgroundColor: 'grey' },
                    }}
                  >
                    <Close
                      sx={{ color: 'rgb(236, 236, 236)', fontSize: '15px' }}
                    />
                  </IconButton>
                </InputAdornment>
              }
            />
          </span>
          <span className={`${classes.searchBody} ${classes.center}`}>
            {isSearching && (
              <CircularProgress
                size="2rem"
                sx={{
                  color: 'black',
                  mt: '3rem',
                  position: 'absolute',
                  zIndex: '1000',
                }}
              />
            )}
          </span>
          <span className={`${classes.searchResultSection}`}>
            <center>
              {uni !== null &&
                uni.map((doc) => {
                  return (
                    <SearchResultContainer
                      src={doc.imgUrl}
                      username={doc.username}
                      id={doc.id}
                    />
                  );
                })}
            </center>
          </span>
        </div>
        <div
          className={classes.extendedContainer}
          ref={extededCon2}
          style={{
            width: `${exteded2 ? '23rem' : '0rem'}`,
          }}
        >
          <IconButton
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setExteded2(false)}
          >
            <CloseSharp />
          </IconButton>
          <Notifications newNotif={updateNewNotif} />
        </div>
      </div>
      {children}
    </div>
  );
}

export default ActionBar;
